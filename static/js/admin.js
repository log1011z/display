function logout() {
    // window.location.href = '/home';
    window.open('/home', '_blank');
}

// 数据库配置
let DB_CONFIG = JSON.parse(localStorage.getItem('dbConfig')) || {
    dbType: 'mysql',
    dbHost: 'localhost',
    dbPort: '3306',
    dbName: 'display', // 已修改为 'display'
    dbUser: 'root',
    dbPassword: '110110',
    storageMode: 'database' // 默认数据库模式
};

// DOM 元素引用
const dbHostInput = document.getElementById('dbHost');
const dbPortInput = document.getElementById('dbPort');
const dbNameInput = document.getElementById('dbName');
const dbUserInput = document.getElementById('dbUser');
const dbPasswordInput = document.getElementById('dbPassword');
const storageModeSelect = document.getElementById('storageMode');
const saveDbConfigBtn = document.getElementById('saveDbConfig');

// 加载并显示配置
function loadDbConfig() {
    dbHostInput.value = DB_CONFIG.dbHost;
    dbPortInput.value = DB_CONFIG.dbPort;
    dbNameInput.value = DB_CONFIG.dbName;
    dbUserInput.value = DB_CONFIG.dbUser;
    dbPasswordInput.value = DB_CONFIG.dbPassword;
    storageModeSelect.value = DB_CONFIG.storageMode;
}

// 保存配置
saveDbConfigBtn.addEventListener('click', () => {
    DB_CONFIG.dbHost = dbHostInput.value;
    DB_CONFIG.dbPort = dbPortInput.value;
    DB_CONFIG.dbName = dbNameInput.value;
    DB_CONFIG.dbUser = dbUserInput.value;
    DB_CONFIG.dbPassword = dbPasswordInput.value;
    DB_CONFIG.storageMode = storageModeSelect.value;
    localStorage.setItem('dbConfig', JSON.stringify(DB_CONFIG));
    swal('成功', '数据库配置已保存！', 'success');
});

// API 接口对象
const DB_API = {
    API_BASE_URL: 'http://127.0.0.1:5000/',

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.API_BASE_URL}${endpoint}`; // 修正了 BASE_URL 到 API_BASE_URL
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `请求失败: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API请求错误 (${method} ${endpoint}):`, error);
            throw error;
        }
    },

    // 通用的数据获取接口（只用于GET请求）
    async getData(dataType, params = {}) {
        let endpoint = `get_${dataType}`;
        const queryParams = new URLSearchParams();
        if (params.date) {
            queryParams.append('date', params.date);
        }
        if (queryParams.toString()) {
            endpoint += `?${queryParams.toString()}`;
        }
        return await this.request(endpoint, 'GET');
    },

    // 用户管理
    async getUsers() {
        return await this.request('get_users', 'GET');
    },
    async saveUser(userData) {
        // 后端 /update_user 似乎用于修改用户，/create 用于注册新用户。
        // 假设这里统一用 /update_user 处理添加和更新，后端需要能识别。
        return await this.request('get_users', 'POST', userData);
    },
    async deleteUser(username) {
        return await this.request('delete_user', 'POST', { username: username });
    },

    // 区域农业数据管理
    async getAreaData() {
        return await this.getData('area');
    },
    async saveAreaData(areaData) {
        return await this.request('get_area', 'POST', areaData);
    },
    async deleteAreaData(prov, type) {
        return await this.request('delete_area', 'POST', { prov: prov, type: type });
    },

    // 气象数据管理
    async getWeatherData(date = null) {
        return await this.getData('weather', { date: date });
    },
    async saveWeatherData(weatherData) {
        return await this.request('get_weather', 'POST', weatherData);
    },
    async deleteWeatherData(date) {
        return await this.request('delete_weather', 'POST', { date: date });
    },

    // 农产品数据管理
    async getCropData(date = null) {
        return await this.getData('crop', { date: date });
    },
    async saveCropData(cropData) {
        return await this.request('get_crop', 'POST', cropData);
    },
    async deleteCropData(type) {
        return await this.request('delete_crop', 'POST', { type: type });
    },

    // 作物类型管理（如果后端没有独立API，此功能可能需要调整）
    async getCropTypes() {
        // 从农产品数据中提取作物类型
        const cropData = await this.getCropData();
        if (cropData && Array.isArray(cropData.type)) {
            return [...new Set(cropData.type)].map(type => ({ type: type })); // 返回唯一类型
        }
        return [];
    },
    // addCropType 函数在前端，如果后端没有对应独立接口，可能需要移除或调整其行为
    async addCropType(newType) {
        // 假设添加作物类型就是添加一个最简的作物记录
        return await this.saveCropData({ type: newType, price: 0, buy: 0, output: 0, grown: 0, day: 0 });
    }
};

// 实时时间显示
function showTime() {
    const now = new Date();
    document.getElementById('showtime').innerHTML = now.toLocaleString();
    setTimeout(showTime, 1000);
}

// 用户管理
async function listUsers() {
    const userTableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    userTableBody.innerHTML = '';
    if (DB_CONFIG.storageMode === 'database') {
        try {
            const data = await DB_API.getUsers();
            data.forEach(user => {
                const tr = userTableBody.insertRow();
                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.anth === 1 ? '管理员' : '普通用户'}</td>
                    <td>
                        <button class="admin-btn" onclick="editUserRow('${user.username}', '${user.password}', ${user.anth})">编辑</button>
                        <button class="admin-btn delete-btn" onclick="deleteUserRow('${user.username}')">删除</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('获取用户列表失败:', error);
            swal('错误', `获取用户列表失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，用户管理功能未实现', 'info');
    }
}

document.getElementById('userForm').onsubmit = async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const authority = parseInt(document.getElementById('authority').value);

    if (!username) {
        swal('错误', '用户名不能为空', 'error');
        return;
    }

    const userData = { username, password, authority };

    if (DB_CONFIG.storageMode === 'database') {
        try {
            await DB_API.saveUser(userData);
            swal('成功', '用户已保存/更新！', 'success');
            this.reset();
            listUsers();
        } catch (error) {
            console.error('保存用户失败 (数据库模式):', error);
            swal('错误', `数据库操作失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，用户保存功能未实现', 'info');
    }
};

function editUserRow(username, password, authority) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('authority').value = authority;
}

async function deleteUserRow(username) {
    // 将 confirm 替换为 swal
    swal({
        title: '确认删除？',
        text: `确定要删除用户 "${username}" 吗？`,
        icon: 'warning',
        buttons: ['取消', '确定'], // 设置按钮文本
        dangerMode: true, // 启用危险模式，按钮会变红
    }).then(async (willDelete) => {
        if (willDelete) { // 如果用户点击“确定”
            if (DB_CONFIG.storageMode === 'database') {
                try {
                    await DB_API.deleteUser(username);
                    swal('成功', '用户删除成功！', 'success');
                    listUsers();
                } catch (error) {
                    console.error('删除用户失败 (数据库模式):', error);
                    swal('错误', `数据库操作失败：${error.message}`, 'error');
                }
            } else {
                swal('信息', '本地存储模式下，用户删除功能未实现', 'info');
            }
        }
    });
}

// 区域数据管理
async function renderAreaTable() {
    const areaTableBody = document.getElementById('areaTable').getElementsByTagName('tbody')[0];
    areaTableBody.innerHTML = ''; // 清空表格内容

    if (DB_CONFIG.storageMode === 'database') {
        try {
            const data = await DB_API.getAreaData(); // 获取区域数据
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const tr = areaTableBody.insertRow();
                    tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.output}</td>
                <td>
                    <button class="admin-btn" onclick="editAreaRow('${item.name}', '${item.type}', ${item.output})">编辑</button>
                    <button class="admin-btn delete-btn" onclick="deleteAreaRow('${item.name}', '${item.type}')">删除</button>
                </td>
            `;
                });
            } else {
                areaTableBody.innerHTML = '<tr><td colspan="4">暂无数据</td></tr>';
            }
        } catch (error) {
            console.error('获取区域数据失败:', error);
            swal('错误', `获取区域数据失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，区域数据功能未实现', 'info');
    }
}

document.getElementById('areaForm').onsubmit = async function (e) {
    e.preventDefault();
    const name = document.getElementById('areaProv').value.trim();
    const type = "粮食"; // 固定为粮食
    const outputVal = parseFloat(document.getElementById('areaYield').value);

    if (!name || isNaN(outputVal)) {
        swal('错误', '请填写所有区域数据字段', 'error');
        return;
    }

    const areaData = { name: name, type: type, output: outputVal };

    if (DB_CONFIG.storageMode === 'database') {
        try {
            await DB_API.saveAreaData(areaData);
            swal('成功', '区域数据已保存/更新！', 'success');
            this.reset();
            renderAreaTable();
        } catch (error) {
            console.error('保存区域数据失败 (数据库模式):', error);
            swal('错误', `数据库操作失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，区域数据保存功能未实现', 'info');
    }
};

function editAreaRow(name, type, outputVal) {
    document.getElementById('areaProv').value = name;
    document.getElementById('areaYield').value = outputVal;
}

async function deleteAreaRow(name, type) {
    // 将 confirm 替换为 swal
    swal({
        title: '确认删除？',
        text: `确定要删除省份 "${name}", 作物类型 "${type}" 的区域数据吗？`,
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            if (DB_CONFIG.storageMode === 'database') {
                try {
                    await DB_API.deleteAreaData(name, type);
                    swal('成功', '区域数据删除成功！', 'success');
                    renderAreaTable();
                } catch (error) {
                    console.error('删除区域数据失败 (数据库模式):', error);
                    swal('错误', `数据库操作失败：${error.message}`, 'error');
                }
            } else {
                swal('信息', '本地存储模式下，区域数据删除功能未实现', 'info');
            }
        }
    });
}

// 气象数据管理
async function renderWeatherTable() {
    const weatherTableBody = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
    weatherTableBody.innerHTML = '';
    if (DB_CONFIG.storageMode === 'database') {
        try {
            const data = await DB_API.getWeatherData();
            // 后端 /get_weather GET 请求返回的是列表，例如 {date:[], temp:[], ...}
            if (data && Array.isArray(data.date) && data.date.length > 0) {
                for (let i = 0; i < data.date.length; i++) {
                    const tr = weatherTableBody.insertRow();
                    const itemDate = data.date[i];
                    tr.innerHTML = `
                        <td>${itemDate}</td>
                        <td>${data.temp[i]}</td>
                        <td>${data.wet[i]}</td>
                        <td>${data.sun[i]}</td>
                        <td>${data.tsoil1[i]}</td>
                        <td>${data.tsoil2[i]}</td>
                        <td>${data.tsoil3[i]}</td>
                        <td>
                            <button class="admin-btn" onclick="editWeatherRow('${itemDate}')">编辑</button>
                            <button class="admin-btn delete-btn" onclick="deleteWeatherRow('${itemDate}')">删除</button>
                        </td>
                    `;
                }
            } else {
                weatherTableBody.innerHTML = '<tr><td colspan="8">暂无数据</td></tr>';
            }
        } catch (error) {
            console.error('获取气象数据失败:', error);
            swal('错误', `获取气象数据失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，气象数据功能未实现', 'info');
    }
}

// 气象数据表单提交处理
document.getElementById('weatherForm').onsubmit = async function (e) {
    e.preventDefault();
    const date = document.getElementById('weatherDate').value;
    const temp = parseFloat(document.getElementById('temp').value);
    const wet = parseFloat(document.getElementById('wet').value);
    const sun = parseFloat(document.getElementById('sun').value);
    const tsoil1 = parseFloat(document.getElementById('tsoil1').value);
    const tsoil2 = parseFloat(document.getElementById('tsoil2').value);
    const tsoil3 = parseFloat(document.getElementById('tsoil3').value);

    if (!date) {
        swal('错误', '请选择日期', 'error');
        return;
    }

    const weatherData = { date, temp, wet, sun, tsoil1, tsoil2, tsoil3 };

    if (DB_CONFIG.storageMode === 'database') {
        try {
            await DB_API.saveWeatherData(weatherData);
            swal('成功', '气象数据已保存/更新！', 'success');
            this.reset();
            renderWeatherTable();
        } catch (error) {
            console.error('保存气象数据失败 (数据库模式):', error);
            swal('错误', `数据库操作失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，气象数据保存功能未实现', 'info');
    }
};

async function editWeatherRow(date) {
    if (DB_CONFIG.storageMode === 'database') {
        try {
            // 获取所有数据，然后找到特定日期的数据
            const response = await DB_API.getWeatherData();
            const index = response.date.findIndex(d => d === date);
            if (index !== -1) {
                const currentYear = new Date().getFullYear();
                // 将后端返回的 "月-日" 格式的日期补全为 "年-月-日" 格式
                // 假设后端返回的 date 已经是 "MM-DD" 格式或者可以直接与年份拼接
                const fullDate = `${currentYear}-${response.date[index]}`;

                document.getElementById('weatherDate').value = fullDate;
                document.getElementById('temp').value = response.temp[index];
                document.getElementById('wet').value = response.wet[index];
                document.getElementById('sun').value = response.sun[index];
                document.getElementById('tsoil1').value = response.tsoil1[index];
                document.getElementById('tsoil2').value = response.tsoil2[index];
                document.getElementById('tsoil3').value = response.tsoil3[index];
            } else {
                swal('错误', '未找到要编辑的气象数据！', 'error');
            }
        } catch (error) {
            console.error('编辑时获取气象数据失败 (数据库模式):', error);
            swal('错误', `获取数据失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，气象数据编辑功能未实现', 'info');
    }
}

async function deleteWeatherRow(date) {
    // 将 confirm 替换为 swal
    swal({
        title: '确认删除？',
        text: `确定要删除日期 "${date}" 的气象数据吗？`,
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            if (DB_CONFIG.storageMode === 'database') {
                try {
                    await DB_API.deleteWeatherData(date);
                    swal('成功', '气象数据删除成功！', 'success');
                    renderWeatherTable();
                } catch (error) {
                    console.error('删除气象数据失败 (数据库模式):', error);
                    swal('错误', `数据库操作失败：${error.message}`, 'error');
                }
            } else {
                swal('信息', '本地存储模式下，气象数据删除功能未实现', 'info');
            }
        }
    });
}

// 农产品数据管理
async function renderCropTable() {
    const cropTableBody = document.getElementById('cropTable').getElementsByTagName('tbody')[0];
    cropTableBody.innerHTML = '';
    if (DB_CONFIG.storageMode === 'database') {
        try {
            const data = await DB_API.getCropData();
            // 后端 /get_crop GET 请求返回的是列表，例如 {type:[], price:[], ...}
            if (data && Array.isArray(data.type) && data.type.length > 0) {
                for (let i = 0; i < data.type.length; i++) {
                    const tr = cropTableBody.insertRow();
                    tr.innerHTML = `
                        <td>${data.type[i]}</td>
                        <td>${data.price[i]}</td>
                        <td>${data.xiaoliang[i]}</td> 
                        <td>${data.output[i]}</td>
                        <td>${data.grown[i]}</td>
                        <td>${data.day[i]}</td>
                        <td>
                            <button class="admin-btn" onclick="editCropRow('${data.type[i]}')">编辑</button>
                            <button class="admin-btn delete-btn" onclick="deleteCropRow('${data.type[i]}')">删除</button>
                        </td>
                    `;
                }
            } else {
                cropTableBody.innerHTML = '<tr><td colspan="7">暂无数据</td></tr>';
            }
        } catch (error) {
            console.error('获取农产品数据失败:', error);
            swal('错误', `获取农产品数据失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，农产品数据功能未实现', 'info');
    }
}

// 农产品数据表单提交处理
document.getElementById('cropForm').onsubmit = async function (e) {
    e.preventDefault();
    const type = document.getElementById('cropName').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const buy = parseInt(document.getElementById('buy').value);
    const output = parseInt(document.getElementById('cropOutput').value);
    const grown = parseInt(document.getElementById('grown').value);
    const day = parseInt(document.getElementById('day').value); // 收获天数

    if (!type || isNaN(price) || isNaN(buy) || isNaN(output) || isNaN(grown) || isNaN(day)) {
        swal('错误', '请填写所有农产品数据字段', 'error');
        return;
    }

    const cropData = { type, price, buy, output, grown, day };

    if (DB_CONFIG.storageMode === 'database') {
        try {
            await DB_API.saveCropData(cropData);
            swal('成功', '农产品数据已保存/更新！', 'success');
            this.reset();
            renderCropTable();
        } catch (error) {
            console.error('保存农产品数据失败 (数据库模式):', error);
            swal('错误', `数据库操作失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，农产品数据保存功能未实现', 'info');
    }
};

async function editCropRow(type) {
    if (DB_CONFIG.storageMode === 'database') {
        try {
            const response = await DB_API.getCropData(); // 获取所有数据，然后找到特定类型的数据
            const index = response.type.findIndex(t => t === type);
            if (index !== -1) {
                document.getElementById('cropName').value = response.type[index];
                document.getElementById('price').value = response.price[index];
                document.getElementById('buy').value = response.xiaoliang[index];
                document.getElementById('cropOutput').value = response.output[index];
                document.getElementById('grown').value = response.grown[index];
                document.getElementById('day').value = response.day[index];
            } else {
                swal('错误', '未找到要编辑的农产品数据！', 'error');
            }
        } catch (error) {
            console.error('编辑时获取农产品数据失败 (数据库模式):', error);
            swal('错误', `获取数据失败：${error.message}`, 'error');
        }
    } else {
        swal('信息', '本地存储模式下，农产品数据编辑功能未实现', 'info');
    }
}

async function deleteCropRow(type) {
    // 将 confirm 替换为 swal
    swal({
        title: '确认删除？',
        text: `确定要删除农产品 "${type}" 的数据吗？`,
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            if (DB_CONFIG.storageMode === 'database') {
                try {
                    await DB_API.deleteCropData(type);
                    swal('成功', '农产品数据删除成功！', 'success');
                    renderCropTable();
                } catch (error) {
                    console.error('删除农产品数据失败 (数据库模式):', error);
                    swal('错误', `数据库操作失败：${error.message}`, 'error');
                }
            } else {
                swal('信息', '本地存储模式下，农产品数据删除功能未实现', 'info');
            }
        }
    });
}

// 渲染作物类型列表（从农产品数据中获取）
async function renderCropTypes() {
    const areaCropTypeSelect = document.getElementById('areaCropType');
    areaCropTypeSelect.innerHTML = ''; // 清空现有选项
    // 固定为"粮食"类型
    const option = document.createElement('option');
    option.value = "粮食";
    option.textContent = "粮食";
    areaCropTypeSelect.appendChild(option);
}

// 渲染所有表格和列表
async function renderAllTables() {
    await listUsers();
    await renderCropTypes(); // 先渲染作物类型以便区域数据使用
    await renderAreaTable();
    await renderWeatherTable();
    await renderCropTable();
}


document.addEventListener('DOMContentLoaded', async () => {
    showTime();
    loadDbConfig();

    // 隐藏所有板块
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // 显示用户管理板块
    document.getElementById('tab-user').style.display = 'block';
    document.querySelector('.tab-btn[data-tab="user"]').classList.add('active');

    // 加载所有表格数据
    await renderAllTables();

    // 添加 Tab 切换逻辑
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function () {
            // 隐藏所有板块
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            // 移除所有按钮的激活状态
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // 显示当前板块并激活按钮
            const tab = this.dataset.tab;
            document.getElementById(`tab-${tab}`).style.display = 'block';
            this.classList.add('active');

            // 刷新对应板块数据
            if (tab === 'area') {
                renderAreaTable();
            } else if (tab === 'weather') {
                renderWeatherTable();
            } else if (tab === 'crop') {
                renderCropTable();
            } else if (tab === 'user') {
                listUsers();
            }
        });
    });
});


// 查找密码输入框和切换图标
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

// 确保这两个元素都存在，避免报错
if (passwordInput && togglePassword) {
    // 为切换图标添加点击事件监听器
    togglePassword.addEventListener('click', function () {
        // 检查当前输入框的类型
        const currentType = passwordInput.getAttribute('type');
        const newType = currentType === 'password' ? 'text' : 'password';
        // 切换输入框的类型
        if (newType === 'text' || newType === 'password') {
            passwordInput.setAttribute('type', newType);

            // 根据新的类型切换图标显示（例如，从“眼睛”到“锁”或“斜杠眼睛”）
            // 您可以根据喜好修改这里的 emoji 或者 class 来切换图标
            this.textContent = (newType === 'password' ? '👁️' : '🔒'); // 切换图标文本
        }
    });
}