import { QuartzComponent } from '@quartz-community/types';

interface D3Config {
    drag: boolean;
    zoom: boolean;
    depth: number;
    scale: number;
    repelForce: number;
    centerForce: number;
    linkDistance: number;
    fontSize: number;
    opacityScale: number;
    removeTags: string[];
    showTags: boolean;
    focusOnHover?: boolean;
    enableRadial?: boolean;
    /** Label visibility before zooming: "all" | "folders" (folder hub nodes only) | "none" */
    showLabels?: "all" | "folders" | "none";
}
interface CategoryColor {
    light: string;
    dark: string;
}
interface GraphOptions {
    localGraph?: Partial<D3Config>;
    globalGraph?: Partial<D3Config>;
    /** Node color per top-level folder. Folders not listed use the gray fallback. */
    categoryColors?: Record<string, CategoryColor>;
}
declare const _default: (userOpts?: Partial<GraphOptions>) => QuartzComponent;

export { type D3Config, _default as Graph, type GraphOptions };
