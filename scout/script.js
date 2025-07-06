window.addEventListener('DOMContentLoaded', init);

function init() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/1vCPb3CjR0_NpkOOmL2LN5Actu0EU4Q-cTRsv39AXtIc/gviz/tq?tqx=out:json";

    fetch(sheetURL)
        .then(res => res.text())
        .then(text => {
            const json = JSON.parse(text.substr(47).slice(0, -2));
            const rows = json.table.rows;

            const data = rows.map(row => ({
                Team: row.c[0].v,
                Points: parseInt(row.c[1].v)
            }));

            showInfo(data);
        });
}

function showInfo(data) {
    data.sort((a, b) => b.Points - a.Points);

    document.getElementById("firstName").innerHTML = `
  <div class="team-name">${data[0].Team}</div>
  <div class="team-points">${data[0].Points}</div>
`;

document.getElementById("secondName").innerHTML = `
  <div class="team-name">${data[1].Team}</div>
  <div class="team-points">${data[1].Points}</div>
`;

document.getElementById("thirdName").innerHTML = `
  <div class="team-name">${data[2].Team}</div>
  <div class="team-points">${data[2].Points}</div>
`;

    const teamList = document.getElementById("teamList");
    teamList.innerHTML = "";

   data.slice(3).forEach(team => {
    const div = document.createElement("div");
    div.className = "team";
    div.innerHTML = `
    <div class="team-name">${team.Team}</div>
    <div class="bar">
        <div class="bar-fill" style="width: ${(team.Points / 3000) * 100}%"></div>
    </div>
    <div class="points">${team.Points}</div>
`;

    teamList.appendChild(div);
});

}

setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.filled + '%';
    });
}, 100);




// انيميشن عند ظهور الطلائع
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const barFill = entry.target.querySelector('.bar-fill');
            const valueDiv = entry.target.querySelector('.points');
            const targetValue = parseInt(valueDiv.dataset.points);
            const targetWidth = entry.target.dataset.filled;

            // تعبئة البار الأزرق تدريجيًا
            barFill.style.transition = "width 2s ease-out";
            barFill.style.width = targetWidth + "%";

            // عد الأرقام تدريجيًا
            let count = 0;
            const duration = 2000; // مدة العد 2 ثانية
            const stepTime = Math.max(Math.floor(duration / targetValue), 20); // تأكد من سرعة مقبولة
            const counter = setInterval(() => {
                count++;
                valueDiv.textContent = count;
                if (count >= targetValue) clearInterval(counter);
            }, stepTime);

            observer.unobserve(entry.target); // مرة واحدة لكل عنصر
        }
    });
}, { threshold: 0.3 });

// راقب جميع عناصر الطلائع
document.querySelectorAll('.team').forEach(team => observer.observe(team));
