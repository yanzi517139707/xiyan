// 全局变量
let uploadedImage = null;
let canvas = null;
let ctx = null;

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('preview-canvas');
    ctx = canvas.getContext('2d');
    
    // 绑定事件
    bindEvents();
    
    // 初始化颜色预览
    updateColorPreview();
});

// 绑定事件
function bindEvents() {
    // 文件上传
    const fileInput = document.getElementById('file-upload');
    fileInput.addEventListener('change', handleFileUpload);
    
    // 颜色选择器
    const textColorInput = document.getElementById('text-color');
    const outlineColorInput = document.getElementById('outline-color');
    textColorInput.addEventListener('input', updateColorPreview);
    outlineColorInput.addEventListener('input', updateColorPreview);
    
    // 生成按钮
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', generateSubtitleImage);
    
    // 保存按钮
    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', saveImage);
    
    // 设置变化时自动更新预览
    const settings = document.querySelectorAll('.settings input, .settings select');
    settings.forEach(setting => {
        setting.addEventListener('input', updatePreview);
    });
    
    // 字幕内容变化时更新预览
    const subtitleContent = document.getElementById('subtitle-content');
    subtitleContent.addEventListener('input', updatePreview);
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    // 显示文件名
    const fileNameDisplay = document.getElementById('file-name');
    fileNameDisplay.textContent = file.name;
    
    // 读取图片
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage = new Image();
        uploadedImage.onload = function() {
            updateCanvasSize();
            updatePreview();
        };
        uploadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// 更新画布大小
function updateCanvasSize() {
    if (!uploadedImage) return;
    
    // 设置画布大小与图片相同
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
}

// 更新颜色预览
function updateColorPreview() {
    const textColor = document.getElementById('text-color').value;
    const outlineColor = document.getElementById('outline-color').value;
    
    const textColorPreview = document.getElementById('text-color-preview');
    const outlineColorPreview = document.getElementById('outline-color-preview');
    
    textColorPreview.style.backgroundColor = textColor;
    outlineColorPreview.style.backgroundColor = outlineColor;
}

// 获取当前设置
function getCurrentSettings() {
    return {
        subtitleHeight: parseInt(document.getElementById('subtitle-height').value),
        fontSize: parseInt(document.getElementById('font-size').value),
        textColor: document.getElementById('text-color').value,
        outlineColor: document.getElementById('outline-color').value,
        fontFamily: document.getElementById('font-family').value,
        fontWeight: document.getElementById('font-weight').value,
        content: document.getElementById('subtitle-content').value
    };
}

// 更新预览
function updatePreview() {
    if (!uploadedImage) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制原图
    ctx.drawImage(uploadedImage, 0, 0);
    
    // 获取设置
    const settings = getCurrentSettings();
    
    // 绘制字幕
    drawSubtitles(settings);
}

// 绘制字幕
function drawSubtitles(settings) {
    const { subtitleHeight, fontSize, textColor, outlineColor, fontFamily, fontWeight, content } = settings;
    
    // 计算字幕区域
    const subtitleY = canvas.height - subtitleHeight;
    
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, subtitleY, canvas.width, subtitleHeight);
    
    // 准备文本设置
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 分割文本为多行
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // 计算每行文本的位置
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = subtitleY + (subtitleHeight - totalHeight) / 2 + fontSize / 2;
    
    // 绘制每行文本
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // 绘制文字轮廓
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 3;
        ctx.strokeText(line, canvas.width / 2, y);
        
        // 绘制文字
        ctx.fillStyle = textColor;
        ctx.fillText(line, canvas.width / 2, y);
    });
}

// 生成字幕图片
function generateSubtitleImage() {
    if (!uploadedImage) {
        alert('请先上传图片');
        return;
    }
    
    updatePreview();
    showSuccessMessage('字幕图片已生成');
}

// 保存图片
function saveImage() {
    if (!uploadedImage) {
        alert('请先生成字幕图片');
        return;
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'subtitle_image.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showSuccessMessage('图片已保存');
}

// 显示成功消息
function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    
    // 3秒后隐藏消息
    setTimeout(() => {
        successMessage.textContent = '';
    }, 3000);
}