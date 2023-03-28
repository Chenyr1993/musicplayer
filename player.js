
var audio = document.getElementById("audio");
var controlPanel = document.getElementById("controlBar");
var btnArea = document.getElementById("btnArea");
var info = document.getElementById("info");
var setVolValue = document.getElementById("setVolValue");
var volValue = document.getElementById("volValue");
var progress = document.getElementById("progress");
var music = document.getElementById("music");

let btnPlay = btnArea.children[0];
let btnMuted = btnArea.children[6];
//audio.load();
//上一首,下一首
//選擇歌曲
function changeMusic(i) {
    let currentIndex = 0;
    if (i != 0) { // 選上下首

        // 要改變的歌單的方向
        let changeStep = i;
        // 當前歌單的位置
        currentIndex = parseInt(music.selectedIndex) + parseInt(changeStep);
        console.log(parseInt(music.selectedIndex), parseInt(changeStep));
        if (currentIndex >= music.options.length || currentIndex < 0) {
            currentIndex = 0;
        }
    } else { // 選單選擇
        // 當前歌單的位置
        currentIndex = music.selectedIndex;
    }
    // 寫入歌曲位置
    music.options[currentIndex].selected = true;
    audio.src = music.options[currentIndex].value;
    audio.title = music.options[currentIndex].innerText;

    audio.load();
    if (btnPlay.innerText == ";")
        playAudio();
}

//全曲循環
function setAllLoop() {
    info.children[2].innerText = info.children[2].innerText == "全曲循環" ? "正常" : "全曲循環";
}
//隨機播放
function setRandom() {
    info.children[2].innerText = info.children[2].innerText == "隨機播放" ? "正常" : "隨機播放";
}
//單曲循環
function setLoop() {
    info.children[2].innerText = info.children[2].innerText == "單曲循環" ? "正常" : "單曲循環";
}
//播放進度拖曳
function setProgressBar() {
    audio.currentTime = progress.value;
}
//將時間格式從秒轉為分與秒
var min = 0,
    sec = 0;

function getTimeFormat(timeSec) {
    if (timeSec) {
        //if...else...三元表達式
        min = parseInt(timeSec / 60);
        sec = parseInt(timeSec % 60);
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        return min + ":" + sec;
    } else {
        return "00:00";
    }
}
//取得目前播放時間
var w = 0;
var r = 0; //這個變數是存放隨機播放的亂數值
getDuration();

function getDuration() {
    info.children[1].innerText = getTimeFormat(audio.currentTime) + " / " + getTimeFormat(audio.duration);
    w = audio.currentTime / audio.duration * 100;
    progress.style.backgroundImage = "-webkit-linear-gradient(left,#c07af2,#c07af2 " + w + "%, #ffffff " + w + "% ,#ffffff)";
    progress.max = parseInt(audio.duration);
    progress.value = parseInt(audio.currentTime);
    //當一首歌播完,要自動換下一首歌
    if (audio.currentTime == audio.duration) {
        console.log(info.children[2].innerText == "單曲循環");
        if (info.children[2].innerText == "單曲循環")
            changeMusic(0);
        else if (info.children[2].innerText == "隨機播放") {
            //在歌曲池子裡隨機抓取一首歌
            r = Math.floor(Math.random() * music.options.length); //0~歌曲最終索引值(目前r=0~4)
            console.log("r=" + r); //假設0
            r = r - music.selectedIndex; //假設目前歌曲索引值=2 , 0-2得到-2
            changeMusic(r);
        }
        //else if (info.children[2].innerText == "全曲循環" && music.selectedIndex == music.options.length - 1)
        //    stopAudio();
        else if (music.selectedIndex == music.options.length - 1) {
            if (info.children[2].innerText == "全曲循環")
                changeMusic(-music.selectedIndex);
            else
                stopAudio();
        } else
            changeMusic(1);
    }

    setTimeout(getDuration, 50);

    //如果目前不是最後一首,前進下一首歌
    //}
}
let muteBtn = 0;
let keepVol = 0;
//設定靜音
function setMuted() {
    muteBtn++;
    audio.muted = !audio.muted;
    btnMuted.style.textDecoration = audio.muted ? "line-through" : "none";
    keepVol = volValue.value;
    if(muteBtn%2==1){console.log(keepVol)
        keepVol=0;
        volValue.value=keepVol;
    }else{
         volValue.value=keepVol;
        setVolume();
    }
    

}
setVolume();
//音量調整
function setVolume() {
    volValue.value = setVolValue.value;
    audio.volume = setVolValue.value / 100;
    setVolValue.style.backgroundImage = "-webkit-linear-gradient(left,#ef7d2c,#ef7d2c " + setVolValue.value + "%, #c8c8c8 " + setVolValue.value + "% ,#c8c8c8)";

    if (volValue.value == 0) {
        setMuted()
    } else {
        btnMuted.style.textDecoration = "none";
    }
}

//音量微調
function btnSetVolume(vol) {
    setVolValue.value = parseInt(volValue.value) + vol;
    setVolume();

}
//快轉及倒轉
function changeTime(sec) {
    audio.currentTime += sec;
}
//音樂播放
function playAudio() {
    audio.play();
    btnPlay.innerText = ";";
    btnPlay.onclick = pauseAudio;
    info.children[0].innerText = "現正播放:" + audio.title;
}
//音樂暫停
function pauseAudio() {
    audio.pause();
    btnPlay.innerText = "4";
    btnPlay.onclick = playAudio;
    info.children[0].innerText = "音樂暫停";
}
//音樂停止
function stopAudio() {
    pauseAudio();
    audio.currentTime = 0;
    info.children[0].innerText = "音樂停止";
}
let songBook = document.querySelector('#songBook');
// 左邊放置區
let songPrepare = document.querySelector('#songPrepare');
// 右邊歌單曲
let songList = document.querySelector('#songList');
// 被拖曳的對象
let dragging_item = null;

//可拖曳區動作
songPrepare.addEventListener('dragstart', function (e) {
    dragging_item = e.target;
})
songList.addEventListener('dragstart', function (e) {
    dragging_item = e.target;
})

//歌單區監聽放置動作
songList.addEventListener("dragover", (event) => {
    event.preventDefault();
});

songList.addEventListener("drop", function (event) {
    event.preventDefault();
    songList.appendChild(dragging_item);
});
//放置區監聽放置動作
songPrepare.addEventListener("dragover", (event) => {
    event.preventDefault();
});

songPrepare.addEventListener("drop", function (event) {
    event.preventDefault();
    songPrepare.appendChild(dragging_item);
});

function updateSong() {
    music.innerHTML = '';
    for (let i = 0; i < songList.children.length; i++) {
        let opt = document.createElement('option');
        opt.value = songList.children[i].getAttribute('title');
        opt.innerHTML = songList.children[i].innerHTML;
        music.appendChild(opt)
    }
    changeMusic(0);
}
// music.addEventListener('change', function (e) {
//     changeMusic(0);

// })
//隱藏&顯示歌單
let bookBtn = btnArea.children[10]
let book = document.querySelector('#book')
let clickNum = true;
function showBook() {
    if (clickNum) {
        book.style.display = 'block';
    } else {
        book.style.display = 'none';
    }
    clickNum = !clickNum;
}