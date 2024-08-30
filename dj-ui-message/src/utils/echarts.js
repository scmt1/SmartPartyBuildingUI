import * as echarts from 'echarts/core'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    TitleComponent
} from 'echarts/components'
import {
    LineChart,
    BarChart,
    PieChart,
    MapChart
} from 'echarts/charts'
import {
    CanvasRenderer,
    SVGRenderer
} from 'echarts/renderers'

echarts.use(
    [GridComponent, LegendComponent, TooltipComponent, ToolboxComponent, LineChart, BarChart, PieChart, CanvasRenderer, SVGRenderer, MapChart, TitleComponent]
)

export default echarts
