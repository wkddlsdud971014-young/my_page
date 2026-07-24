/* ═══════════════════════════════════════════════════════════════
   회고 도우미 위젯 - 내 포트폴리오(index.html)에 붙이는 버튼

   쓰는 법: 내 index.html의 </body> 바로 위에 이 한 줄만 넣으세요.
       <script src="retro-widget.js"></script>

   그러면 오른쪽 아래에 "회고 도우미" 버튼이 자동으로 생깁니다.
   버튼을 누르면 챗봇이 네 칸(예상/관측/간극/다음)을 물어보고,
   다 답하면 완성된 회고를 복사할 수 있습니다.

   AI를 쓰지 않습니다. 정해진 네 질문을 순서대로 물을 뿐이라
   키도 요금도 서버도 필요 없습니다.
   ═══════════════════════════════════════════════════════════════ */

(function () {

  /* 이미 붙어 있으면 중복 생성 안 함 */
  if (document.getElementById('rw-fab')) return;

  var ACCENT = '#2f6df6';

  var css = ''
  + '.rw-fab{position:fixed;right:22px;bottom:22px;height:56px;padding:0 22px 0 18px;'
  +   'border-radius:30px;background:'+ACCENT+';border:none;cursor:pointer;z-index:99998;'
  +   'color:#fff;box-shadow:0 6px 22px rgba(0,0,0,.24);display:flex;align-items:center;gap:10px;'
  +   'font-family:-apple-system,BlinkMacSystemFont,"Malgun Gothic","Apple SD Gothic Neo",sans-serif;'
  +   'font-size:15px;font-weight:650;transition:transform .2s}'
  + '.rw-fab:hover{transform:translateY(-2px)}'
  + '.rw-fab svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'
  + '.rw-fab.rw-open .rw-msg{display:none}.rw-fab .rw-x{display:none}.rw-fab.rw-open .rw-x{display:block}'

  + '.rw-box{position:fixed;right:22px;bottom:90px;width:380px;height:min(560px,74vh);'
  +   'background:#fff;border:1px solid #e6e8ec;border-radius:18px;z-index:99997;'
  +   'display:none;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.22);'
  +   'font-family:-apple-system,BlinkMacSystemFont,"Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#1c1e21}'
  + '.rw-box.rw-on{display:flex}'
  + '.rw-box *{box-sizing:border-box}'
  + '.rw-head{display:flex;align-items:center;gap:11px;padding:15px 17px;border-bottom:1px solid #e6e8ec}'
  + '.rw-av{width:38px;height:38px;border-radius:50%;background:'+ACCENT+';color:#fff;display:grid;place-items:center;font-weight:800;flex:none}'
  + '.rw-head b{display:block;font-size:15px}.rw-head span{font-size:12px;color:#6b7280}'
  + '.rw-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f6f7f9}'
  + '.rw-row{display:flex}.rw-row.rw-me{justify-content:flex-end}'
  + '.rw-bub{max-width:82%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word}'
  + '.rw-row.rw-bot .rw-bub{background:#fff;border:1px solid #e6e8ec;border-bottom-left-radius:5px}'
  + '.rw-row.rw-me .rw-bub{background:'+ACCENT+';color:#fff;border-bottom-right-radius:5px}'
  + '.rw-prog{font-size:11.5px;color:#6b7280;text-align:center;padding:2px 0}'
  + '.rw-foot{border-top:1px solid #e6e8ec;padding:11px;display:flex;gap:8px;background:#fff}'
  + '.rw-foot textarea{flex:1;border:1px solid #e6e8ec;border-radius:10px;padding:10px 12px;font-size:14px;'
  +   'font-family:inherit;resize:none;height:42px;max-height:100px;background:#f6f7f9;color:#1c1e21}'
  + '.rw-foot textarea:focus{outline:2px solid '+ACCENT+';outline-offset:-1px}'
  + '.rw-send{flex:none;width:44px;border-radius:10px;border:none;background:'+ACCENT+';color:#fff;cursor:pointer;font-size:18px}'
  + '.rw-send:disabled{opacity:.4;cursor:default}'
  + '.rw-result{background:#1e2126;color:#e9ebee;border-radius:12px;padding:14px;'
  +   'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.75;white-space:pre-wrap;word-break:break-word}'
  + '.rw-copy{margin-top:8px;width:100%;padding:11px;border-radius:9px;border:none;cursor:pointer;background:#1f8a4c;color:#fff;font-size:14px;font-weight:650;font-family:inherit}'
  + '.rw-copy.rw-done{background:#146c3a}'
  + '.rw-again{margin-top:8px;width:100%;padding:10px;border-radius:9px;cursor:pointer;background:transparent;border:1px solid #e6e8ec;color:#6b7280;font-size:13.5px;font-family:inherit}'
  + '@media(max-width:520px){.rw-box{right:12px;left:12px;width:auto;bottom:86px;height:70vh}.rw-fab{right:16px;bottom:16px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<button class="rw-fab" id="rw-fab" aria-label="회고 도우미">'
  +   '<svg class="rw-msg" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.7-.8L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>'
  +   '<svg class="rw-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  +   '<span>회고 도우미</span>'
  + '</button>'
  + '<div class="rw-box" id="rw-box">'
  +   '<div class="rw-head"><div class="rw-av">회</div>'
  +     '<div><b>회고 도우미</b><span>네 칸을 하나씩 채워요</span></div></div>'
  +   '<div class="rw-log" id="rw-log"></div>'
  +   '<div class="rw-foot"><textarea id="rw-in" placeholder="여기에 답을 적고 Enter"></textarea>'
  +     '<button class="rw-send" id="rw-send">↑</button></div>'
  + '</div>';
  document.body.appendChild(wrap);

  var fab = document.getElementById('rw-fab');
  var box = document.getElementById('rw-box');
  var log = document.getElementById('rw-log');
  var input = document.getElementById('rw-in');
  var send = document.getElementById('rw-send');

  var STEPS = [
    { key:'label', ask:'회고를 시작할게요. 먼저 - 무엇을 하다가 있었던 일인가요?\n(예: 오후 실습, 첫 배포)' },
    { key:'e', ask:'좋아요. 그 일을 하기 전에, 어떻게 될 거라고 예상했나요?' },
    { key:'a', ask:'그래서 실제로는 어떻게 됐나요? 일어난 일만 적어요.' },
    { key:'g', ask:'예상과 실제, 그 차이는 뭐였나요? 한 줄이면 돼요.' },
    { key:'n', ask:'마지막. 내일 할 동작 하나로 바꾸면? 큰 다짐 말고 오늘 가능한 크기로.' }
  ];
  var step = 0, ans = {}, started = false;

  function today(){
    var d = new Date(), p = function(n){ return (n<10?'0':'')+n; };
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
  }
  function bubble(text, me){
    var row = document.createElement('div');
    row.className = 'rw-row ' + (me ? 'rw-me' : 'rw-bot');
    var b = document.createElement('div');
    b.className = 'rw-bub'; b.textContent = text;
    row.appendChild(b); log.appendChild(row); log.scrollTop = log.scrollHeight;
  }
  function progress(){
    var p = document.createElement('div');
    p.className = 'rw-prog'; p.textContent = '(' + Math.min(step,4) + '/4)';
    log.appendChild(p); log.scrollTop = log.scrollHeight;
  }

  fab.onclick = function(){
    var on = box.classList.toggle('rw-on');
    fab.classList.toggle('rw-open', on);
    if (on && !started){ started = true; setTimeout(function(){ bubble(STEPS[0].ask, false); input.focus(); }, 250); }
    else if (on){ input.focus(); }
  };

  function submit(){
    var v = input.value.trim();
    if (!v) return;
    bubble(v, true);
    ans[STEPS[step].key] = v;
    input.value = '';
    step++;
    if (step < STEPS.length){
      setTimeout(function(){ bubble(STEPS[step].ask, false); if (step>=1) progress(); }, 380);
    } else {
      setTimeout(finish, 420);
    }
  }

  function finish(){
    input.disabled = true; send.disabled = true;
    input.placeholder = '회고가 완성됐어요';
    bubble('회고가 완성됐어요. 아래 초록 버튼으로 복사해서 쓰세요.', false);

    var text = '[' + today() + (ans.label ? ' · ' + ans.label : '') + ']\n'
      + '예상: ' + (ans.e||'') + '\n'
      + '관측: ' + (ans.a||'') + '\n'
      + '간극: ' + (ans.g||'') + '\n'
      + '다음: ' + (ans.n||'');

    var row = document.createElement('div');
    row.className = 'rw-row rw-bot';
    var boxi = document.createElement('div');
    boxi.style.maxWidth = '100%';
    var pre = document.createElement('div');
    pre.className = 'rw-result'; pre.textContent = text;
    var copy = document.createElement('button');
    copy.className = 'rw-copy'; copy.textContent = '회고 복사';
    copy.onclick = function(){
      navigator.clipboard.writeText(text).then(function(){
        copy.textContent = '복사됐습니다'; copy.classList.add('rw-done');
        setTimeout(function(){ copy.textContent = '회고 복사'; copy.classList.remove('rw-done'); }, 2500);
      });
    };
    var again = document.createElement('button');
    again.className = 'rw-again'; again.textContent = '다시 쓰기';
    again.onclick = reset;
    boxi.appendChild(pre); boxi.appendChild(copy); boxi.appendChild(again);
    row.appendChild(boxi); log.appendChild(row); log.scrollTop = log.scrollHeight;
  }

  function reset(){
    step = 0; ans = {};
    log.innerHTML = '';
    input.disabled = false; send.disabled = false; input.value = '';
    input.placeholder = '여기에 답을 적고 Enter';
    bubble(STEPS[0].ask, false); input.focus();
  }

  send.onclick = submit;
  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); submit(); }
  });

})();
