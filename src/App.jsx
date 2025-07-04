import React, { useState, useEffect } from "react";
import "./App.css";

function getRandomScore() {
  return Math.floor(Math.random() * 41) + 60; // 60~100
}

function getRandomComment() {
  const comments = [
    "恭喜你，考得不错！",
    "分数很神秘，继续努力！",
    "你是地生小天才！",
    "分数随机，别当真哦~",
    "地生王者就是你！",
    "你是老师的骄傲！"
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

function getRandomEmoji() {
  const emojis = ["🎉", "😂", "🥳", "😜", "🤪", "😎", "🤡", "👻", "🦄", "🌈", "💯", "🔥"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// 简单烟花动画组件
function Fireworks({ show }) {
  if (!show) return null;
  return (
    <div className="fireworks">
      {[...Array(7)].map((_, i) => (
        <div key={i} className={`firework fw${i+1}`}></div>
      ))}
    </div>
  );
}

function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [showPrank, setShowPrank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [egg, setEgg] = useState(null); // 彩蛋内容
  const [showFireworks, setShowFireworks] = useState(false);
  const [theme, setTheme] = useState(() => {
    // 默认跟随系统
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [shareAnim, setShareAnim] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setShowPrank(false);
    setEgg(null);
    setShowFireworks(false);
    setTimeout(() => {
      let score = getRandomScore();
      let comment = getRandomComment();
      let emoji = getRandomEmoji();
      let egg = null;
      let triggerFireworks = false;
      // 特殊输入彩蛋
      if (name.trim() === "666" || id.trim() === "666" || name.includes("彩蛋")) {
        score = 100;
        comment = "你触发了隐藏彩蛋！666！";
        emoji = "🥚";
        egg = "恭喜你发现了隐藏彩蛋！";
        triggerFireworks = true;
      }
      setResult({ name, id, score, comment });
      setEmoji(emoji);
      setEgg(egg);
      setLoading(false);
      setShowFireworks(triggerFireworks);
      setTimeout(() => setShowPrank(true), 2000);
    }, 1200);
  };

  // 分享按钮功能
  const handleShare = () => {
    if (!result) return;
    const text = `姓名：${result.name}\n准考证号：${result.id}\n分数：${result.score}\n评语：${result.comment}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setShareAnim(true);
    setTimeout(() => setShareAnim(false), 800);
    alert("分数信息已复制，可粘贴到微信/QQ等处分享！");
  };

  // 弹窗点击遮罩关闭
  const handlePrankMaskClick = (e) => {
    if (e.target.classList.contains("prank-modal")) {
      setShowPrank(false);
    }
  };
  // 免责声明弹窗点击遮罩关闭
  const handleDisclaimerMaskClick = (e) => {
    if (e.target.classList.contains("disclaimer-modal")) {
      setShowDisclaimerModal(false);
    }
  };

  return (
    <div className="container">
      {/* 主题切换按钮 */}
      <div className="theme-toggle" onClick={handleThemeToggle} title="切换深浅色">
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="color-spinner"></div>
        </div>
      )}
      <h1>内蒙古地生会考分数查询</h1>
      <form onSubmit={handleSubmit} className="query-form">
        <input
          type="text"
          placeholder="姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="准考证号"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
        <button type="submit" className={loading ? "loading" : ""} disabled={loading}>
          {loading && <span className="spinner"></span>}
          {loading ? "查询中..." : "查询分数"}
        </button>
      </form>
      {result && (
        <div className="result egg-animate">
          <Fireworks show={showFireworks} />
          <div style={{fontSize: "2.2rem", marginBottom: 8}}>{emoji}</div>
          <h2>查询结果</h2>
          <p>姓名：{result.name}</p>
          <p>准考证号：{result.id}</p>
          <p>分数：<b>{result.score}</b></p>
          <p>评语：{result.comment}</p>
          {egg && <div className="egg-hint">{egg}</div>}
          <button className={`share-btn${shareAnim ? ' share-anim' : ''}`} onClick={handleShare}>
            <span role="img" aria-label="share">🔗</span> 分享
          </button>
        </div>
      )}
      {showPrank && (
        <div className="prank-modal" onClick={handlePrankMaskClick}>
          <div className="prank-content">
            <h2>哈哈哈！</h2>
            <p style={{fontSize: "1.2rem", margin: "16px 0"}}>你被骗啦！<br />本网站是整蛊用的，分数是随机生成的，请勿当真！</p>
            <button onClick={() => setShowPrank(false)}>我知道了</button>
          </div>
        </div>
      )}
      {/* 免责声明浮动按钮 */}
      <div className="disclaimer-fab" onClick={() => setShowDisclaimerModal(true)} title="免责声明">
        <span className="fab-icon">!</span>
      </div>
      {/* 免责声明弹窗 */}
      {showDisclaimerModal && (
        <div className="disclaimer-modal" onClick={handleDisclaimerMaskClick}>
          <div className="disclaimer-content">
            <div className="disclaimer-icon-animate">⚠️</div>
            <div style={{fontWeight: 600, fontSize: "1.1rem", margin: "10px 0 6px 0"}}>免责声明</div>
            <div style={{color: "#d32f2f", fontSize: "1rem", lineHeight: 1.7}}>
              本网站仅供娱乐整蛊，所有分数均为随机生成，请勿当真！<br />如有不适，请及时关闭页面。<br />
              <span style={{fontSize: "0.9rem", color: "#888"}}>© 2024 NMGS Prank</span>
            </div>
            <button className="disclaimer-close" onClick={() => setShowDisclaimerModal(false)}>我知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
