import { QuartzConfig } from "./quartz/cfg"
import { ProcessedContent } from "./quartz/plugins/vfile"

// 노트끼리 서로 링크하지 않아서 그래프 뷰가 흩어진 점으로만 보인다.
// 그래프가 읽는 contentIndex에만 "노트 → 상위 폴더 → ... → 홈" 링크를 추가해 폴더 트리 형태로 묶는다.
// 페이지 본문이나 백링크에는 영향을 주지 않도록 ContentIndex 이미터에 넘기는 데이터만 바꾼다.

// "ai/rag" -> "ai/", "ai/index" -> "/", "index" -> null
function parentSlug(slug: string): string | null {
  if (slug === "index") return null
  const parts = slug.split("/")
  if (parts[parts.length - 1] === "index") parts.pop()
  parts.pop()
  return parts.length > 0 ? parts.join("/") + "/" : "/"
}

function withFolderLinks(content: ProcessedContent[]): ProcessedContent[] {
  return content.map(([tree, file]) => {
    const slug = file.data.slug
    const parent = slug && !slug.startsWith("tags") ? parentSlug(slug) : null
    if (!parent) return [tree, file]

    const proxy = Object.create(file)
    proxy.data = { ...file.data, links: [...(file.data.links ?? []), parent] }
    return [tree, proxy]
  })
}

export function addFolderLinks(config: QuartzConfig) {
  const contentIndex = config.plugins.emitters.find((e) => e.name === "ContentIndex")
  if (!contentIndex) return

  const { emit, partialEmit } = contentIndex
  contentIndex.emit = (ctx, content, resources) => emit(ctx, withFolderLinks(content), resources)
  if (partialEmit) {
    contentIndex.partialEmit = (ctx, content, resources, changeEvents) =>
      partialEmit(ctx, withFolderLinks(content), resources, changeEvents)
  }
}
