// 图片字幕生成器 JavaScript

// 全局变量
let uploadedImage = null;
let canvas = null;
let ctx = null;

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    bindEvents();
});

// 初始化Canvas
function initializeCanvas() {
    canvas = document.getElementById('preview-canvas');
    ctx = canvas.getContext('2d');
    
    // 设置默认Canvas大小
    canvas.width = 600;
    canvas.height = 400;
    
    // 绘制默认提示
    drawDefaultCanvas();
}

// 绘制默认Canvas提示
function drawDefaultCanvas() {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#999';
    ctx.font = '18px 微软雅黑';
    ctx.textAlign = 'center';
    ctx.fillText('请上传图片', canvas.width / 2, canvas.height / 2);
}

// 绑定事件
function bindEvents() {
    // 图片上传事件
    const fileUpload = document.getElementById('file-upload');
    fileUpload.addEventListener('change', handleFileUpload);
    
    // 生成按钮事件
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', generateSubtitleImage);
    
    // 保存按钮事件
    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', saveImage);
    
    // 颜色选择器事件
    const textColor = document.getElementById('text-color');
    const textColorPreview = document.getElementById('text-color-preview');
    textColor.addEventListener('input', () => {
        textColorPreview.style.backgroundColor = textColor.value;
    });
    
    const outlineColor = document.getElementById('outline-color');
    const outlineColorPreview = document.getElementById('outline-color-preview');
    outlineColor.addEventListener('input', () => {
        outlineColorPreview.style.backgroundColor = outlineColor.value;
    });
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    // 显示文件名
    const fileName = document.getElementById('file-name');
    fileName.textContent = file.name;
    
    // 读取图片
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            displayImage(img);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// 显示图片
function displayImage(img) {
    // 计算合适的尺寸
    const maxWidth = 600;
    const maxHeight = 500;
    
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }
    
    if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }
    
    // 设置Canvas尺寸
    canvas.width = width;
    canvas.height = height;
    
    // 绘制图片
    ctx.drawImage(img, 0, 0, width, height);
}

// 获取设置参数
function getSettings() {
    return {
        subtitleHeight: parseInt(document.getElementById('subtitle-height').value),
        fontSize: parseInt(document.getElementById('font-size').value),
        textColor: document.getElementById('text-color').value,
        outlineColor: document.getElementById('outline-color').value,
        fontFamily: document.getElementById('font-family').value,
        fontWeight: document.getElementById('font-weight').value,
        subtitleContent: document.getElementById('subtitle-content').value
    };
}

// 生成字幕图片
function generateSubtitleImage() {
    if (!uploadedImage) {
        alert('请先上传图片！');
        return;
    }
    
    const settings = getSettings();
    
    // 重新绘制原始图片
    displayImage(uploadedImage);
    
    // 处理字幕内容
    const lines = settings.subtitleContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
        alert('请输入字幕内容！');
        return;
    }
    
    // 计算字幕总高度
    const totalSubtitleHeight = lines.length * settings.subtitleHeight;
    
    // 绘制字幕背景和文字
    lines.forEach((line, index) => {
        // 计算字幕位置
        const y = canvas.height - totalSubtitleHeight + (index * settings.subtitleHeight);
        
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // 半透明黑色背景
        ctx.fillRect(0, y, canvas.width, settings.subtitleHeight);
        
        // 设置文字样式
        ctx.font = `${settings.fontWeight} ${settings.fontSize}px ${settings.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 绘制文字轮廓
        ctx.strokeStyle = settings.outlineColor;
        ctx.lineWidth = 2;
        ctx.strokeText(line, canvas.width / 2, y + settings.subtitleHeight / 2);
        
        // 绘制文字
        ctx.fillStyle = settings.textColor;
        ctx.fillText(line, canvas.width / 2, y + settings.subtitleHeight / 2);
    });
    
    // 显示成功提示
    showSuccessMessage('字幕图片生成成功！');
}

// 保存图片
function saveImage() {
    if (!uploadedImage) {
        alert('请先生成字幕图片！');
        return;
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'subtitle-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 显示成功消息
function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}