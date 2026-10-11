"""Notebook conversion checks using temporary study folders and saved outputs."""

import importlib.util
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from urllib.parse import unquote

import nbformat


SPEC = importlib.util.spec_from_file_location(
    "convert_notebooks", Path(__file__).with_name("convert-notebooks.py")
)
converter = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(converter)

PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/sioAAAAASUVORK5CYII="


class ConvertNotebooksTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.study = Path(self.temp_dir.name) / "study"
        self.study.mkdir()

    def notebook(self, name, cells=None):
        path = self.study / name
        path.parent.mkdir(parents=True, exist_ok=True)
        nbformat.write(
            nbformat.v4.new_notebook(
                cells=cells or [nbformat.v4.new_markdown_cell("# Test notebook")]
            ),
            path,
        )
        return path

    def assert_image_targets_exist(self, markdown_path):
        text = markdown_path.read_text(encoding="utf-8")
        targets = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", text)
        self.assertTrue(targets, "Converted Markdown should link to exported images")
        for target in targets:
            self.assertTrue(
                (markdown_path.parent / unquote(target.strip("<>"))).is_file(),
                target,
            )

    def test_saved_outputs_export_without_executing_cells(self):
        source = "raise RuntimeError('cells must not execute')"
        self.notebook(
            "saved.ipynb",
            [
                nbformat.v4.new_code_cell(
                    source,
                    execution_count=1,
                    outputs=[
                        nbformat.v4.new_output(
                            "stream", name="stdout", text="Previously saved output\n"
                        ),
                        nbformat.v4.new_output(
                            "display_data", data={"image/png": PNG}
                        ),
                    ],
                )
            ],
        )

        self.assertEqual(converter.convert_notebooks(self.study), 1)
        markdown = self.study / "saved.md"
        text = markdown.read_text(encoding="utf-8")
        self.assertTrue(text.startswith(converter.GENERATED_MARKER))
        self.assertIn(source, text)
        self.assertIn("Previously saved output", text)
        self.assertTrue(list((self.study / "saved_files").glob("*.png")))
        self.assert_image_targets_exist(markdown)

    def test_korean_spaced_path_and_markdown_attachment(self):
        notebook = self.notebook(
            "한글 폴더/노트북 예제.ipynb",
            [
                nbformat.v4.new_markdown_cell(
                    "# 첨부 이미지\n![픽셀](attachment:pixel.png)",
                    attachments={"pixel.png": {"image/png": PNG}},
                )
            ],
        )

        self.assertEqual(converter.convert_notebooks(self.study), 1)
        markdown = notebook.with_suffix(".md")
        text = markdown.read_text(encoding="utf-8")
        self.assertNotIn("attachment:", text)
        targets = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", text)
        for target in targets:
            self.assertNotIn(" ", target)
            self.assertIn("%20", target)
        self.assertTrue((notebook.parent / "노트북 예제_files" / "pixel.png").is_file())
        self.assert_image_targets_exist(markdown)

    def test_excluded_paths_are_not_converted(self):
        excluded = [
            ".hidden.ipynb",
            ".hidden/notebook.ipynb",
            ".ipynb_checkpoints/notebook.ipynb",
            "private/notebook.ipynb",
            "node_modules/notebook.ipynb",
            "templates/notebook.ipynb",
        ]
        for name in excluded:
            self.notebook(name)
        included = self.notebook("nested/visible.ipynb")

        self.assertEqual(converter.convert_notebooks(self.study), 1)
        self.assertTrue(included.with_suffix(".md").is_file())
        for name in excluded:
            self.assertFalse((self.study / name).with_suffix(".md").exists())

    def test_manual_markdown_collision_preserves_content_before_any_conversion(self):
        self.notebook("a.ipynb")
        self.notebook("z.ipynb")
        markdown = self.study / "z.md"
        authored = "# 직접 작성한 글\n\nKeep this exact content.\n"
        markdown.write_text(authored, encoding="utf-8")

        with self.assertRaises(ValueError):
            converter.convert_notebooks(self.study)
        self.assertEqual(markdown.read_text(encoding="utf-8"), authored)
        self.assertFalse((self.study / "a.md").exists())

    def test_unowned_assets_collision_preserves_files(self):
        self.notebook("assets.ipynb")
        folder = self.study / "assets_files"
        folder.mkdir()
        existing = folder / "keep.txt"
        existing.write_text("authored asset", encoding="utf-8")

        with self.assertRaises(ValueError):
            converter.convert_notebooks(self.study)
        self.assertEqual(existing.read_text(encoding="utf-8"), "authored asset")
        self.assertFalse((self.study / "assets.md").exists())

    def test_generated_markdown_can_be_regenerated(self):
        self.notebook("repeat.ipynb", [nbformat.v4.new_markdown_cell("Old content")])
        self.assertEqual(converter.convert_notebooks(self.study), 1)
        self.notebook("repeat.ipynb", [nbformat.v4.new_markdown_cell("New content")])

        self.assertEqual(converter.convert_notebooks(self.study), 1)
        text = (self.study / "repeat.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith(converter.GENERATED_MARKER))
        self.assertIn("New content", text)
        self.assertNotIn("Old content", text)

    def test_empty_directory_has_no_output(self):
        self.assertEqual(converter.convert_notebooks(self.study), 0)
        self.assertEqual(list(self.study.iterdir()), [])

    def test_corrupt_notebook_fails_cli(self):
        (self.study / "broken.ipynb").write_text("invalid JSON", encoding="utf-8")
        result = subprocess.run(
            [sys.executable, SPEC.origin, str(self.study)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            check=False,
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("Notebook conversion failed:", result.stderr)
        self.assertFalse((self.study / "broken.md").exists())


if __name__ == "__main__":
    unittest.main()
