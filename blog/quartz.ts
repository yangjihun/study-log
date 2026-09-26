import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { addFolderLinks } from "./folder-links"

const config = await loadQuartzConfig()
addFolderLinks(config)
export default config
export const layout = await loadQuartzLayout()
