import React, { useState, useEffect, useRef } from "react";
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

// 鼠标跟随粒子组件
function MouseParticles() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      // 随机生成粒子
      if (Math.random() > 0.7) {
        setParticles(prev => [...prev.slice(-5), {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        }]);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 1000));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mouse-particles">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
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

// 彩带动画组件
function Confetti({ show }) {
  if (!show) return null;
  return (
    <div className="confetti">
      {[...Array(50)].map((_, i) => (
        <div key={i} className={`confetti-piece c${i % 5 + 1}`}></div>
      ))}
    </div>
  );
}

// 打字机效果组件
function TypewriterText({ text, speed = 100 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayText}<span className="cursor">|</span></span>;
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState(() => {
    // 默认跟随系统
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [shareAnim, setShareAnim] = useState(false);
  const [clickCount, setClickCount] = useState(0); // 隐藏点击计数器
  const [showTips, setShowTips] = useState(false); // 提示信息
  const [pageLoaded, setPageLoaded] = useState(false); // 页面加载状态
  const [buttonRipple, setButtonRipple] = useState(null); // 按钮波纹效果

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 页面加载动画
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Enter 提交表单
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (name && id && !loading) {
          handleSubmit(e);
        }
      }
      // Ctrl/Cmd + T 切换主题
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        handleThemeToggle();
      }
      // Ctrl/Cmd + S 显示分享
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && result) {
        e.preventDefault();
        handleShare();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [name, id, loading, result]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 按钮波纹效果
  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRipple(e);
    setLoading(true);
    setResult(null);
    setShowPrank(false);
    setEgg(null);
    setShowFireworks(false);
    setShowConfetti(false);
    setTimeout(() => {
      let score = getRandomScore();
      let comment = getRandomComment();
      let emoji = getRandomEmoji();
      let egg = null;
      let triggerFireworks = false;
      let triggerConfetti = false;
      
      // 特殊输入彩蛋
      const nameLower = name.trim().toLowerCase();
      const idLower = id.trim().toLowerCase();
      
      if (nameLower === "666" || idLower === "666" || nameLower.includes("彩蛋")) {
        score = 100;
        comment = "你触发了隐藏彩蛋！666！";
        emoji = "🥚";
        egg = "恭喜你发现了隐藏彩蛋！";
        triggerFireworks = true;
      } else if (nameLower === "满分" || nameLower === "100") {
        score = 100;
        comment = "满分！你是地生之王！";
        emoji = "👑";
        egg = "满分彩蛋！";
        triggerConfetti = true;
      } else if (nameLower === "零分" || nameLower === "0") {
        score = 0;
        comment = "零分！别灰心，继续努力！";
        emoji = "😭";
        egg = "零分彩蛋！";
      } else if (nameLower.includes("老师") || nameLower.includes("teacher")) {
        score = 95;
        comment = "老师好！您辛苦了！";
        emoji = "👨‍🏫";
        egg = "老师彩蛋！";
      } else if (nameLower === "admin" || nameLower === "管理员") {
        score = 999;
        comment = "管理员模式！";
        emoji = "⚡";
        egg = "管理员彩蛋！";
        triggerFireworks = true;
        triggerConfetti = true;
      }
      
      setResult({ name, id, score, comment });
      setEmoji(emoji);
      setEgg(egg);
      setLoading(false);
      setShowFireworks(triggerFireworks);
      setShowConfetti(triggerConfetti);
      setTimeout(() => setShowPrank(true), 2000);
    }, 1200);
  };

  // 分享按钮功能
  const handleShare = (e) => {
    if (!result) return;
    createRipple(e);
    const text = `姓名：${result.name}\n准考证号：${result.id}\n分数：${result.score}\n评语：${result.comment}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setShareAnim(true);
    setTimeout(() => setShareAnim(false), 800);
    alert("分数信息已复制，可粘贴到微信/QQ等处分享！");
  };

  // 隐藏点击彩蛋
  const handleHiddenClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        alert("🎉 你发现了隐藏点击彩蛋！点击了5次！");
        return 0;
      }
      return newCount;
    });
  };

  // 显示快捷键提示
  const handleShowTips = () => {
    setShowTips(true);
    setTimeout(() => setShowTips(false), 3000);
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
    <div className={`container ${pageLoaded ? 'loaded' : ''}`}>
      <MouseParticles />
      {/* 主题切换按钮 */}
      <div className="theme-toggle" onClick={handleThemeToggle} title="切换深浅色 (Ctrl+T)">
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
      {/* 快捷键提示按钮 */}
      <div className="tips-btn" onClick={handleShowTips} title="快捷键提示">
        ⌨️
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="color-spinner"></div>
        </div>
      )}
      <h1 onClick={handleHiddenClick} style={{cursor: 'pointer'}}>
        <TypewriterText text="内蒙古地生会考分数查询" speed={150} />
      </h1>
      <form onSubmit={handleSubmit} className="query-form">
        <input
          type="text"
          placeholder="姓名"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="input-animate"
        />
        <input
          type="text"
          placeholder="准考证号"
          value={id}
          onChange={e => setId(e.target.value)}
          required
          className="input-animate"
        />
        <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
          {loading && <span className="spinner"></span>}
          {loading ? "查询中..." : "查询分数 (Ctrl+Enter)"}
        </button>
      </form>
      {result && (
        <div className="result egg-animate">
          <Fireworks show={showFireworks} />
          <Confetti show={showConfetti} />
          <div style={{fontSize: "2.2rem", marginBottom: 8}}>{emoji}</div>
          <h2>查询结果</h2>
          <p>姓名：{result.name}</p>
          <p>准考证号：{result.id}</p>
          <p>分数：<b>{result.score}</b></p>
          <p>评语：{result.comment}</p>
          {egg && <div className="egg-hint">{egg}</div>}
          <button className={`share-btn${shareAnim ? ' share-anim' : ''}`} onClick={handleShare}>
            <span role="img" aria-label="share">🔗</span> 分享 (Ctrl+S)
          </button>
        </div>
      )}
      {showPrank && (
        <div className="prank-modal" onClick={handlePrankMaskClick}>
          <div className="prank-content">
            <h2>哈哈哈！</h2>
            <p style={{fontSize: "1.2rem", margin: "16px 0"}}>你被骗啦！<br />本网站是整蛊用的，分数是随机生成的，请勿当真！</p>
            <button onClick={(e) => { createRipple(e); setShowPrank(false); }}>我知道了</button>
          </div>
        </div>
      )}
      {/* 快捷键提示 */}
      {showTips && (
        <div className="tips-modal">
          <div className="tips-content">
            <h3>⌨️ 快捷键</h3>
            <p>Ctrl+Enter: 查询分数</p>
            <p>Ctrl+T: 切换主题</p>
            <p>Ctrl+S: 分享结果</p>
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
            <button className="disclaimer-close" onClick={(e) => { createRipple(e); setShowDisclaimerModal(false); }}>我知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
