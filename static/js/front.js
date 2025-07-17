// ===========================================
// 背景图轮播功能 (更平滑的交叉淡入淡出)
// ===========================================

// 定义你的背景图片数组
// 请确保这些图片存在于 'static/img/' 目录下
const backgroundImages = [
    'url(static/img/bg.jpg)', // 替换为你的第一张图片路径
    'url(static/img/bg0.jpg)', // 替换为你的第一张图片路径
    'url(static/img/bg2.jpg)', // 替换为你的第二张图片路径
    'url(static/img/bg3.jpg)',  // 替换为你的第三张图片路径
    'url(static/img/bg4.jpg)',  // 替换为你的第三张图片路径
    'url(static/img/bg5.jpg)', // 替换为你的第三张图片路径
    'url(static/img/bg6.jpg)', // 替换为你的第三张图片路径
    'url(static/img/bg7.jpg)',  // 替换为你的第三张图片路径
    'url(static/img/bg8.jpg)',  // 替换为你的第三张图片路径
    // 可以添加更多图片
];

// 获取两个背景图层元素
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');

let currentImageIndex = 0; // 当前显示的图片索引
let activeLayer = bgLayer1; // 当前可见的图层
let inactiveLayer = bgLayer2; // 当前隐藏的图层

const bgIntervalTime = 5000; // 轮播间隔时间，单位毫秒 (例如 7 秒)

// 设置初始背景图
function setInitialBackgroundSeamless() {
    if (backgroundImages.length === 0) {
        // 如果没有图片，确保所有图层都隐藏，让 body 的 background-color 显示
        bgLayer1.classList.remove('active');
        bgLayer2.classList.remove('active');
        return;
    }
    // 设置第一张图片到活跃图层，并使其可见
    activeLayer.style.backgroundImage = backgroundImages[currentImageIndex];
    activeLayer.classList.add('active');
}

// 执行背景图切换和淡入淡出
function rotateBackgroundSeamless() {
    // 如果图片数量不足以轮播，则直接返回
    if (backgroundImages.length <= 1) {
        return;
    }

    // 计算下一张图片的索引
    const nextImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    const nextImageUrl = backgroundImages[nextImageIndex];

    // 将下一张图片设置到当前隐藏的图层
    inactiveLayer.style.backgroundImage = nextImageUrl;

    // 交叉淡入淡出：将活跃图层设为非活跃，非活跃图层设为活跃
    // CSS 的 opacity transition 会处理平滑过渡
    activeLayer.classList.remove('active');
    inactiveLayer.classList.add('active');

    // 交换活跃和非活跃图层的引用，为下一次切换做准备
    [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
    currentImageIndex = nextImageIndex;
}

// 页面加载完成后立即设置初始背景并启动轮播
document.addEventListener('DOMContentLoaded', () => {
    setInitialBackgroundSeamless(); // 设置第一张背景图

    // 只有当图片数量大于1时才启动轮播定时器
    if (backgroundImages.length > 1) {
        setInterval(rotateBackgroundSeamless, bgIntervalTime);
    }
});




// < !--退出按钮 -->
function logout() {
    // swal({
    // 	title: '确认退出？',
    // 	text: '退出后将返回登录页面。',
    // 	type: 'warning',
    // 	showCancelButton: true,
    // 	confirmButtonText: '确定',
    // 	cancelButtonText: '取消',
    // 	closeOnConfirm: false // 等手动跳转
    // }, function(isConfirm) {
    // if (isConfirm) {
    // 	window.location.href = 'login.html';
    // 		}
    // 	});
    // }
    window.location.href = '/logout';
}


// 初始化ECharts实例
const myChart = echarts.init(document.getElementById('main'));

// 省会城市数据
const capitalData = [{
    name: '北京',
    value: [116.405285, 39.904989]
},
{
    name: '天津',
    value: [117.190182, 39.125596]
},
{
    name: '石家庄',
    value: [114.502461, 38.045474]
},
{
    name: '太原',
    value: [112.549248, 37.857014]
},
{
    name: '呼和浩特',
    value: [111.670801, 40.818311]
},
{
    name: '沈阳',
    value: [123.429096, 41.796767]
},
{
    name: '长春',
    value: [125.324501, 43.886841]
},
{
    name: '哈尔滨',
    value: [126.642464, 45.756967]
},
{
    name: '上海',
    value: [121.472644, 31.231706]
},
{
    name: '南京',
    value: [118.767413, 32.041544]
},
{
    name: '杭州',
    value: [120.153576, 30.287459]
},
{
    name: '合肥',
    value: [117.283042, 31.86119]
},
{
    name: '福州',
    value: [119.306239, 26.075302]
},
{
    name: '南昌',
    value: [115.892151, 28.676493]
},
{
    name: '济南',
    value: [117.000923, 36.675807]
},
{
    name: '郑州',
    value: [113.665412, 34.757975]
},
{
    name: '武汉',
    value: [114.298572, 30.584355]
},
{
    name: '长沙',
    value: [112.982279, 28.19409]
},
{
    name: '广州',
    value: [113.280637, 23.125178]
},
{
    name: '南宁',
    value: [108.320004, 22.815478]
},
{
    name: '海口',
    value: [110.199891, 20.044001]
},
{
    name: '重庆',
    value: [106.504962, 29.533155]
},
{
    name: '成都',
    value: [104.065735, 30.659462]
},
{
    name: '贵阳',
    value: [106.713478, 26.578343]
},
{
    name: '昆明',
    value: [102.712251, 25.040609]
},
{
    name: '拉萨',
    value: [91.132212, 29.660361]
},
{
    name: '西安',
    value: [108.948024, 34.263161]
},
{
    name: '兰州',
    value: [103.823557, 36.058039]
},
{
    name: '西宁',
    value: [101.778916, 36.623178]
},
{
    name: '银川',
    value: [106.278179, 38.46637]
},
{
    name: '乌鲁木齐',
    value: [87.617733, 43.792818]
},
{
    name: '香港',
    value: [114.165460, 22.275340]
},
{
    name: '澳门',
    value: [113.549090, 22.198951]
},
{
    name: '台北',
    value: [121.509062, 25.044332]
}
];

// 获取地图数据（新接口）
const MAP_API = {
    // 获取地图数据
    getMapData: async () => {
        try {
            const response = await fetch('/get_area');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取地图数据失败:', error);
            // 返回默认格式
            return [{
                name: '北京',
                type: '粮食',
                output: 1200
            },
            {
                name: '天津',
                type: '蔬菜',
                output: 800
            },
            {
                name: '河北',
                type: '粮食',
                output: 1500
            },
            {
                name: '山西',
                type: '油料',
                output: 600
            },
            {
                name: '内蒙古',
                type: '粮食',
                output: 900
            },
            {
                name: '辽宁',
                type: '蔬菜',
                output: 1100
            },
            {
                name: '吉林',
                type: '粮食',
                output: 1300
            },
            {
                name: '黑龙江',
                type: '粮食',
                output: 1400
            },
            {
                name: '上海',
                type: '蔬菜',
                output: 950
            },
            {
                name: '江苏',
                type: '粮食',
                output: 1600
            },
            {
                name: '浙江',
                type: '蔬菜',
                output: 1200
            },
            {
                name: '安徽',
                type: '粮食',
                output: 1100
            },
            {
                name: '福建',
                type: '蔬菜',
                output: 1000
            },
            {
                name: '江西',
                type: '粮食',
                output: 900
            },
            {
                name: '山东',
                type: '粮食',
                output: 1800
            },
            {
                name: '河南',
                type: '粮食',
                output: 1700
            },
            {
                name: '湖北',
                type: '蔬菜',
                output: 1300
            },
            {
                name: '湖南',
                type: '粮食',
                output: 1000
            },
            {
                name: '广东',
                type: '蔬菜',
                output: 1500
            },
            {
                name: '广西',
                type: '蔬菜',
                output: 1200
            },
            {
                name: '海南',
                type: '蔬菜',
                output: 800
            },
            {
                name: '重庆',
                type: '蔬菜',
                output: 1100
            },
            {
                name: '四川',
                type: '粮食',
                output: 1400
            },
            {
                name: '贵州',
                type: '粮食',
                output: 800
            },
            {
                name: '云南',
                type: '蔬菜',
                output: 1000
            },
            {
                name: '西藏',
                type: '粮食',
                output: 300
            },
            {
                name: '陕西',
                type: '粮食',
                output: 900
            },
            {
                name: '甘肃',
                type: '粮食',
                output: 600
            },
            {
                name: '青海',
                type: '粮食',
                output: 400
            },
            {
                name: '宁夏',
                type: '粮食',
                output: 500
            },
            {
                name: '新疆',
                type: '粮食',
                output: 700
            },
            {
                name: '香港',
                type: '蔬菜',
                output: 200
            },
            {
                name: '澳门',
                type: '蔬菜',
                output: 150
            },
            {
                name: '台湾',
                type: '蔬菜',
                output: 600
            }
            ];
        }
    }
};

// 初始化地图数据
let provinceData = [];

// 获取地图数据
const loadMapData = async () => {
    try {
        const rawData = await MAP_API.getMapData();
        // 让 value 字段等于 output（产量）
        const provinceData = rawData.map(item => ({
            ...item,
            value: item.output
        }));
        // 计算产量的最小值和最大值
        const values = provinceData.map(item => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        // 更新地图配置
        const option = {
            // 标题配置
            title: {
                text: '🌾 AgriSage 🌾',
                left: 'center',
                top: '2%',
                textStyle: {
                    color: '#2d5016',
                    fontSize: 36,
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    fontFamily: 'Arial, sans-serif'
                },
                backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(230, 255, 200, 0.8)'
                    },
                    {
                        offset: 0.5,
                        color: 'rgba(180, 230, 150, 0.8)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(210, 255, 210, 0.8)'
                    }
                    ]
                },
                borderRadius: 15,
                padding: [10, 20],
                borderColor: '#228b22',
                borderWidth: 0.5,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },

            // 提示框配置
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (params.data && params.data.value && Array.isArray(params.data.value)) {
                        // 省会城市的提示
                        return params.name + '<br>坐标：(' +
                            params.data.value[0].toFixed(2) + ', ' +
                            params.data.value[1].toFixed(2) + ')';
                    } else {
                        // 省份的提示 - 显示省份、种类、产量
                        const data = params.data;
                        if (data && data.type && data.output) {
                            return params.name + '<br>' +
                                '种类：' + data.type + '<br>' +
                                '产量：' + data.output + '吨';
                        } else {
                            return params.name + '<br>数值：' + (params.value || 0);
                        }
                    }
                }
            },

            // 视觉映射配置
            visualMap: {
                min: minValue,
                max: maxValue,
                text: ['高产', '低产'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#D9F7BE', '#A7E99A', '#7CCB6D', '#4BB24C', '#228B22']
                },
                left: "5%",
                top: "50%"
            },

            // 地图系列配置
            series: [{
                name: '省份数据',
                type: 'map',
                map: 'china',
                roam: false,
                zoom: 1.1, // 将地图放大 20% (默认是1)
                scaleLimit: {
                    min: 1,
                    max: 3
                },
                label: {
                    show: true,
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 15
                },
                itemStyle: {
                    areaColor: '#B0E0B0',
                    borderColor: '#5C995C',
                    borderWidth: 0.5
                },
                emphasis: {
                    label: {
                        color: '#333'
                    },
                    itemStyle: {
                        areaColor: '#ADD8E6'
                    }
                },
                select: { // 选中状态（如果需要）
                    label: {
                        color: '#333'
                    },
                    itemStyle: {
                        areaColor: '#FFD700', // 与高亮状态一致
                        borderWidth: 1,
                        borderColor: '#DAA520'
                    }
                },
                data: provinceData
            },
            {
                name: '省会城市',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin',
                symbolSize: 30,
                label: {
                    show: true,
                    formatter: '{b}',
                    position: 'right',
                    fontSize: 10
                },
                itemStyle: {
                    color: '#f00'
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: capitalData
            }
            ]
        };
        myChart.setOption(option);
    } catch (error) {
        console.error('加载地图数据失败:', error);
    }
};

// 加载地图数据并显示图表
loadMapData();


// 获取传感器数据（新接口）
const HUMIDITY_API = {
    // 获取全部传感器数据
    getSensorData: async () => {
        try {
            const response = await fetch('/get_weather');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取传感器数据失败:', error);
            // 返回默认格式
            return {
                date: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'],
                wet: [65, 72, 68, 75, 70, 73, 68],
                temp: [18, 25, 33, 28, 17, 10, 25],
                sun: [300, 400, 200, 359, 286, 120, 130],
                tol1: [],
                tol2: [],
                tol3: [],
            };
        }
    }
};

// 获取产量数据（新接口）
const YIELD_API = {
    // 获取产量数据
    getYieldData: async () => {
        try {
            const response = await fetch('/get_crop');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取产量数据失败:', error);
            // 返回默认格式
            return {
                type: ['水稻', '小麦', '玉米', '大豆', '蔬菜', '水果'],
                output: [1200, 800, 1500, 600, 2000, 900],
                price: [2.5, 2.8, 2.2, 3.0, 1.5, 4.0],
                xiaoliang: [1200, 800, 1500, 600, 2000, 900],
                day: [50, 60, 70, 40, 45, 55],
                grown: [20, 30, 70, 10, 15, 25],
            };
        }
    }
};

// 获取今日天气数据（新接口）
const WEATHER_API = {
    // 获取天气数据
    getWeatherData: async () => {
        try {
            const response = await fetch('/get_temp');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取天气数据失败:', error);
            // 返回默认格式
            return {
                now: {
                    temperature: 25,
                    humidity: 65,
                    windSpeed: 10,
                    windDirection: '南风'
                },
                forecast: []
            };
        }
    },

    // 更新天气信息显示
    updatetodayWeatherDisplay: async () => {
        const data = await WEATHER_API.getWeatherData();
        const now = data?.data?.now || {};
        document.getElementById('todayTemp').textContent = now.temperature;
        document.getElementById('todayHumidity').textContent = now.humidity;
        document.getElementById('todayWindSpeed').textContent = now.windSpeed;
        document.getElementById('todayWindDirection').textContent = now.windDirection;
    }
};

// 初始化时调用更新天气显示
WEATHER_API.updatetodayWeatherDisplay();


//湿度模块
// 初始化湿度折线图
const humidityChart = echarts.init(document.getElementById('humidityChart'));

// 计算过去七天值数组
function getSevenDayAverages(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const start = Math.max(0, i - 6);
        const slice = arr.slice(start, i + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        result.push(Number(avg.toFixed(2)));
    }
    // 只取最后7天
    return result.slice(-7);
}

// 更新今日湿度显示
// const updateTodayHumidity = async () => {
//     const data = await HUMIDITY_API.getSensorData();
//     const todayHumidity = data.wet && data.wet.length > 0 ? data.wet[data.wet.length - 1] : '--';
//     document.getElementById('todayHumidity').textContent = todayHumidity;
// };

// 更新湿度折线图（七天）
const updateHumidityChart = async () => {
    const data = await HUMIDITY_API.getSensorData();
    const len = data.date.length;
    const dates = len >= 7 ? data.date.slice(len - 7) : data.date;
    const Wets = data.wet;

    const humidityOption = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}%'
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%',
                fontSize: 10
            }
        },
        series: [{
            data: Wets,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#1890ff',
                width: 3
            },
            itemStyle: {
                color: '#1890ff'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(24, 144, 255, 0.3)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(24, 144, 255, 0.1)'
                    }
                    ]
                }
            }
        }],
        grid: {
            left: '13%',
            right: '10%',
            top: '20%',
            bottom: '15%'
        }
    };
    humidityChart.setOption(humidityOption);
};

//温度模块
// 初始化温度折线图
const tempChart = echarts.init(document.getElementById('tempChart'));

// 更新今日温度显示
// const updateTodayTemp = async () => {
//     const data = await HUMIDITY_API.getSensorData();
//     let todayTemp = '--';
//     if (data.temp && data.temp.length > 0 && typeof data.temp[data.temp.length - 1] === 'number') {
//         todayTemp = data.temp[data.temp.length - 1];
//     } else {
//         todayTemp = 27; // 自定义默认值
//     }
//     document.getElementById('todayTemp').textContent = todayTemp;
// };

// 更新温度折线图（七天）
const updateTempChart = async () => {
    const data = await HUMIDITY_API.getSensorData();
    let Temps = [];
    let dates = [];
    if (data.temp && data.temp.length > 0 && data.date && data.date.length > 0) {
        const len = data.date.length;
        dates = len >= 7 ? data.date.slice(len - 7) : data.date;
        Temps = data.temp;
    } else {
        // 自定义默认值
        dates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'];
        Temps = [18, 25, 33, 28, 17, 10, 25];
    }

    const tempOption = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}℃'
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 40,
            axisLabel: {
                formatter: '{value}℃',
                fontSize: 10
            }
        },
        series: [{
            data: Temps,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#ff7e00',
                width: 3
            },
            itemStyle: {
                color: '#ff7e00'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(255, 126, 0, 0.3)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(255, 126, 0, 0.1)'
                    }
                    ]
                }
            }
        }],
        grid: {
            left: '13%',
            right: '10%',
            top: '20%',
            bottom: '15%'
        }
    };
    tempChart.setOption(tempOption);
};

//光照模块
// 初始化光照折线图
const sunChart = echarts.init(document.getElementById('sunChart'));

// // 更新今日光照显示
// const updateTodaySun = async () => {
//     const data = await HUMIDITY_API.getSensorData();
//     let todaySun = '--';
//     if (data.sun && data.sun.length > 0) {
//         todaySun = data.sun[data.sun.length - 1];
//     } else {
//         todaySun = 1000; // 自定义默认值
//     }
//     document.getElementById('todaySun').textContent = todaySun;
// };

// 更新光照折线图（七天）
const updateSunChart = async () => {
    const data = await HUMIDITY_API.getSensorData();
    let Suns = [];
    let dates = [];
    if (data.sun && data.sun.length > 0 && data.date && data.date.length > 0) {
        const len = data.date.length;
        dates = len >= 7 ? data.date.slice(len - 7) : data.date;
        Suns = data.sun;
    } else {
        // 自定义默认值
        dates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'];
        Suns = [800, 1200, 1500, 900, 1000, 1100, 950];
    }

    const sunOption = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}lux'
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 400,
            axisLabel: {
                formatter: '{value}lux',
                fontSize: 10
            }
        },
        series: [{
            data: Suns,
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#f7b500',
                width: 3
            },
            itemStyle: {
                color: '#f7b500'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(247, 181, 0, 0.3)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(247, 181, 0, 0.1)'
                    }
                    ]
                }
            }
        }],
        grid: {
            left: '13%',
            right: '10%',
            top: '20%',
            bottom: '15%'
        }
    };
    sunChart.setOption(sunOption);
};

//土壤湿度模块
// 初始化土壤湿度堆叠面积图
const soilChart = echarts.init(document.getElementById('soilChart'));

// 获取三层土壤湿度数据并渲染
const updateSoilChart = async () => {
    const data = await HUMIDITY_API.getSensorData();
    let dates = [];
    let tsoil = [
        [],
        [],
        []
    ];
    if (data.date && data.date.length > 0) {
        const len = data.date.length;
        dates = len >= 7 ? data.date.slice(len - 7) : data.date;
        for (let i = 0; i < 3; i++) {
            const key = 'tsoil' + (i + 1);
            // 保证每层数据长度和dates一致，且有默认值
            if (data[key] && data[key].length > 0) {
                const arr = len >= 7 ? data[key].slice(len - 7) : data[key];
                tsoil[i] = arr.length === dates.length ? arr : Array(dates.length).fill(10 + i * 2);
            } else {
                tsoil[i] = Array(dates.length).fill(10 + i * 2);
            }
        }
    } else {
        // 默认数据
        dates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'];
        tsoil = [
            [20, 22, 21, 23, 22, 21, 20],
            [18, 19, 20, 21, 20, 19, 18],
            [15, 16, 17, 18, 17, 16, 15]
        ];
    }

    const colors = [
        ['#1890ff', '#a0cfff'],
        ['#13c2c2', '#8ce8e8'],
        ['#52c41a', '#b7eb8f']
    ];

    const series = [];
    for (let i = 0; i < 3; i++) {
        series.push({
            name: `土壤${i + 1}层`,
            type: 'line',
            stack: 'Total',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                width: 2
            },
            areaStyle: {
                opacity: 0.7,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: colors[i][0]
                    },
                    {
                        offset: 1,
                        color: colors[i][1]
                    }
                    ]
                }
            },
            itemStyle: {
                color: colors[i][0]
            },
            emphasis: {
                focus: 'series'
            },
            data: tsoil[i]
        });
    }

    const soilOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['土壤1层', '土壤2层', '土壤3层'],
            bottom: 0,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 11
            },
            type: 'plain'
        },
        grid: {
            left: '8%',
            right: '8%',
            top: 30,
            bottom: 40
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
                fontSize: 12,
                interval: 0,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 12
            },
            min: 0,
            max: 100
        },
        series
    };
    soilChart.setOption(soilOption);
};

//产量模块
// 初始化产量柱形图
const yieldChart = echarts.init(document.getElementById('yieldChart'));

// 更新产量柱形图
const updateYieldChart = async () => {
    const data = await YIELD_API.getYieldData();

    // 使用后端数据
    const yieldData = data.type.map((name, index) => ({
        name: name,
        value: data.output[index] || 0,
        type: data.type[index] || '其他'
    }));

    const yieldOption = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                const data = params[0];
                const index = data.dataIndex;
                return `${data.name}<br/>产量: ${data.value}吨`;
            }
        },
        grid: {
            left: '15%',
            right: '8%',
            top: '15%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.type,
            axisLabel: {
                fontSize: 10,
                interval: 0,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 9,
                formatter: '{value}吨',
                margin: 8
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        series: [{
            data: yieldData.map(item => item.value),
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: '#52c41a'
                    },
                    {
                        offset: 1,
                        color: '#95de64'
                    }
                    ]
                }
            },
            emphasis: {
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#389e0d'
                        },
                        {
                            offset: 1,
                            color: '#73d13d'
                        }
                        ]
                    }
                }
            }
        }]
    };
    yieldChart.setOption(yieldOption);
};

//收成天数模块
// 初始化收成天数柱形图
const harvestChart = echarts.init(document.getElementById('harvestChart'));

// 更新收成天数柱形图
// ================== 收成天数模块（美观 + 对齐） ==================
// ================== 修复收成天数柱形图（解决对齐问题） ==================
const updateHarvestChart = async () => {
    const data = await YIELD_API.getYieldData();

    // 构造带进度的数据
    const harvestData = data.type.map((name, index) => {
        const total = data.day[index] || 90; //总生长时间
        //const grown = Math.floor(Math.random() * total);        //已生长时间
        const grown = data.grown[index] || 0; //已生长时间
        const percent = Math.round((grown / total) * 100); //百分比
        return {
            name,
            total,
            grown,
            percent,
        };
    });

    const harvestOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params) => {
                const item = params[0];
                return `
          <div style="font-size:14px;color:#333">
            <b>${item.data.name}</b><br/>
            已生长：<b>${item.data.grown}天</b><br/>
            总周期：<b>${item.data.total}天</b><br/>
            进度：<b>${item.data.percent}%</b>
          </div>
        `;
            }
        },
        grid: {
            left: '12%',
            right: '18%',
            top: '5%',
            bottom: '5%'
        },
        xAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                show: false,
                fontSize: 10,
                color: '#666'
            },
            splitLine: {
                show: false,
                lineStyle: {
                    type: 'dashed',
                    color: '#ddd'
                }
            }
        },
        yAxis: [
            //左侧y轴
            {
                type: 'category',
                data: harvestData.map(d => `${d.name}`),
                axisLabel: {
                    fontSize: 12,
                    color: '#333',
                    width: 80,
                    interval: 0,
                    overflow: 'truncate'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            //右侧y轴
            {
                type: 'category',
                position: 'right',
                data: harvestData.map(d => `${d.total}天`),
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 12,
                    color: '#666',
                    padding: [0, 0, 0, 15] // 增加左侧内边距 
                }
            }
        ],
        series: [
            // 背景总长度
            {
                type: 'bar',
                barWidth: 18,
                barGap: '-100%',
                data: harvestData.map(d => ({
                    value: 100,
                    name: d.name, // 添加name属性
                    grown: d.grown, // 添加grown属性
                    total: d.total, // 添加total属性
                    percent: d.percent, // 添加percent属性
                    itemStyle: {
                        color: '#f0f0f0',
                        borderRadius: [0, 10, 10, 0],
                        borderWidth: 1,
                        borderColor: '#ddd'
                    }
                })),
                z: 1
            },
            // 已生长进度
            {
                type: 'bar',
                barWidth: 18,
                barGap: '-100%',
                data: harvestData.map(d => {
                    // 根据 percent 动态生成颜色
                    const colorStops = d.percent < 30 ? [{
                        offset: 0,
                        color: '#ffa940'
                    },
                    {
                        offset: 1,
                        color: '#ffd591'
                    }
                    ] :
                        d.percent < 50 ? [{
                            offset: 0,
                            color: '#ffec3d'
                        },
                        {
                            offset: 1,
                            color: '#fff566'
                        }
                        ] : [{
                            offset: 0,
                            color: '#52c41a'
                        },
                        {
                            offset: 1,
                            color: '#95de64'
                        }
                        ];

                    return {
                        value: d.percent,
                        name: d.name,
                        grown: d.grown,
                        total: d.total,
                        percent: d.percent,
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops
                            },
                            borderRadius: [0, 10, 10, 0],
                            shadowColor: 'rgba(0, 150, 0, 0.3)',
                            shadowBlur: 5
                        },
                        label: {
                            show: true,
                            position: d.percent > 75 ? 'insideRight' : 'right',
                            formatter: param => {
                                const icon = param.data.percent < 30 ? '🟠' : param.data
                                    .percent < 50 ? '🟡' : '🟢';
                                return `${param.data.percent}% ${icon}`;
                            },
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#333',
                            distance: 8
                        }
                    };
                }),
                z: 2
            }
        ]
    };

    harvestChart.setOption(harvestOption);
};

// 更新农产品价格和销量展示
const updateProductStats = async () => {
    const data = await YIELD_API.getYieldData();
    const statsGrid = document.getElementById('statsGrid');

    if (!data.type || !data.price || !data.xiaoliang) {
        console.error('数据格式错误');
        return;
    }

    let html = '';
    for (let i = 0; i < data.type.length; i++) {
        const productName = data.type[i];
        const xiaoliang = data.xiaoliang[i] || 0;
        const price = data.price[i] || 0;

        // 同一产品的价格和销量横向排列
        html += `
                    <div class="stat-item">
                        <div class="product-name">${productName}</div>
                        <div class="stats-row">
                            <div class="price-section">
                                <div class="stat-icon">💰</div>
                                <div class="stat-label">价格</div>
                                <div class="stat-value">¥${price}/斤</div>
                            </div>
                            <div class="output-section">
                                <div class="stat-icon">📈</div>
                                <div class="stat-label">销量</div>
                                <div class="stat-value">${xiaoliang}吨</div>
                            </div>
                        </div>
                    </div>
                `;
    }

    statsGrid.innerHTML = html;
};

// 初始化所有数据
const initPanelData = async () => {
    //await updateTodayHumidity();
    await updateHumidityChart();
    //await updateTodayTemp();
    await updateTempChart();
    //await updateTodaySun();
    await updateSunChart();
    await updateSoilChart();
    await updateYieldChart();
    await updateHarvestChart();
    await updateProductStats();
    await updatetodayWeatherDisplay();
};

// 页面加载时初始化数据
initPanelData();

// 定时更新
//setInterval(initPanelData, 5 * 60 * 1000);

// 实时时间更新功能
var t = setTimeout(showtime, 1000);

function showtime() {
    clearTimeout(t);
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var s = d.getSeconds();
    document.getElementById("showtime").innerHTML =
        y + "年" + m + "月" + day + "日 " + h + "时" + min + "分" + s + "秒";
    t = setTimeout(showtime, 1000);
}

// 页面窗口变化时自适应
window.addEventListener('resize', function () {
    myChart.resize();
    humidityChart.resize();
    tempChart.resize();
    sunChart.resize();
    soilChart.resize();
    yieldChart.resize();
    harvestChart.resize();
});
