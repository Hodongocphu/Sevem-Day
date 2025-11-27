// Thời gian hôm nay
let today = new Date().toLocaleDateString();
document.getElementById("today-date").textContent = today;

// Load dữ liệu từ localStorage
let userData = JSON.parse(localStorage.getItem("userData")) || {
    lastCheckin: null,
    streak: 0,
    exp: 0,
    expHistory: [] // [{date: '25/11/2025', exp: 10}, ...]
};

// Cập nhật hiển thị
function updateDisplay() {
    document.getElementById("streak").textContent = userData.streak;
    document.getElementById("exp").textContent = userData.exp;
    updateChart();
}

// Điểm danh
document.getElementById("checkin-btn").addEventListener("click", function(){
    if(userData.lastCheckin === today){
        document.getElementById("checkin-msg").textContent = "Hôm nay bạn đã điểm danh rồi!";
        return;
    }

    // Nếu ngày trước đó là hôm qua → streak +1
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayStr = yesterday.toLocaleDateString();

    if(userData.lastCheckin === yesterdayStr){
        userData.streak += 1;
    } else {
        userData.streak = 1;
    }

    // Cộng EXP
    let gainedExp = 10;
    userData.exp += gainedExp;

    // Lưu lịch sử EXP
    userData.expHistory.push({date: today, exp: gainedExp});

    userData.lastCheckin = today;
    localStorage.setItem("userData", JSON.stringify(userData));

    document.getElementById("checkin-msg").textContent = `Điểm danh thành công! +${gainedExp} EXP`;
    updateDisplay();
});

// Biểu đồ EXP (dùng Canvas)
function updateChart() {
    let canvas = document.getElementById("expChart");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let history = userData.expHistory.slice(-7); // 7 ngày gần nhất
    let barWidth = 50;
    let gap = 15;

    history.forEach((item, index) => {
        let barHeight = item.exp * 5; // scale EXP
        ctx.fillStyle = "#558ec7";
        ctx.fillRect(index*(barWidth+gap), canvas.height - barHeight, barWidth, barHeight);

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText(item.date.split('/')[1]+"/"+item.date.split('/')[0], index*(barWidth+gap), canvas.height - barHeight - 5);
    });
}

// Khởi tạo
updateDisplay();
