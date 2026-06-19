import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './scroll.css';

const LOGO_PATHS = [
  'M 146.5 57 L 247.5 57 L 256 65.5 L 256 117 L 238 117 L 238 75 L 156 75 L 156 117 L 138 117 L 138 65.5 L 146.5 57 Z ',
  'M 192.5 128 L 200.5 128 L 218.5 136 L 223.5 137 L 226.5 139 L 228.5 139 L 231.5 141 L 233.5 141 L 236.5 143 L 238.5 143 L 241.5 145 L 243.5 145 L 246.5 147 L 248.5 147 L 251.5 149 L 253.5 149 L 256.5 151 L 258.5 151 L 261.5 153 L 263.5 153 L 266.5 155 L 268.5 155 L 271.5 157 L 273.5 157 L 276.5 159 L 278.5 159 L 281.5 161 L 283.5 161 L 286.5 163 L 288.5 163 L 291.5 165 L 293.5 165 L 296.5 167 L 298.5 167 L 301.5 169 L 303.5 169 L 306.5 171 L 308.5 171 L 311.5 173 L 313.5 173 L 316.5 175 L 318.5 175 L 321.5 177 L 326 178 L 320 195 L 316.5 195 L 313.5 193 L 311.5 193 L 308.5 191 L 306.5 191 L 303.5 189 L 301.5 189 L 298.5 187 L 296.5 187 L 293.5 185 L 291.5 185 L 288.5 183 L 286.5 183 L 283.5 181 L 281.5 181 L 278.5 179 L 276.5 179 L 273.5 177 L 271.5 177 L 268.5 175 L 266.5 175 L 253.5 169 L 251.5 169 L 223.5 157 L 221.5 157 L 218.5 155 L 203.5 150 L 200.5 148 L 194.5 147 L 189.5 150 L 187.5 150 L 184.5 152 L 182.5 152 L 179.5 154 L 177.5 154 L 174.5 156 L 172.5 156 L 169.5 158 L 167.5 158 L 164.5 160 L 162.5 160 L 159.5 162 L 157.5 162 L 154.5 164 L 152.5 164 L 149.5 166 L 147.5 166 L 144.5 168 L 142.5 168 L 139.5 170 L 137.5 170 L 134.5 172 L 132.5 172 L 129.5 174 L 127.5 174 L 124.5 176 L 122.5 176 L 119.5 178 L 117.5 178 L 89.5 190 L 87.5 190 L 84.5 192 L 82.5 192 L 79.5 194 L 74.5 195 L 72 191.5 L 72 189.5 L 68 181.5 L 68 178 L 77.5 174 L 79.5 174 L 82.5 172 L 84.5 172 L 87.5 170 L 89.5 170 L 92.5 168 L 94.5 168 L 97.5 166 L 99.5 166 L 102.5 164 L 104.5 164 L 107.5 162 L 109.5 162 L 112.5 160 L 114.5 160 L 117.5 158 L 119.5 158 L 122.5 156 L 124.5 156 L 127.5 154 L 129.5 154 L 132.5 152 L 134.5 152 L 137.5 150 L 139.5 150 L 142.5 148 L 144.5 148 L 147.5 146 L 149.5 146 L 152.5 144 L 154.5 144 L 157.5 142 L 159.5 142 L 162.5 140 L 164.5 140 L 167.5 138 L 169.5 138 L 172.5 136 L 174.5 136 L 177.5 134 L 179.5 134 L 182.5 132 L 184.5 132 L 192.5 128 Z ',
  'M 102.5 210 L 150.5 258 L 242.5 258 L 291.5 210 L 304 223.5 L 253.5 274 L 248.5 276 L 144.5 276 L 140.5 274 L 90 223.5 L 102.5 210 Z ',
  'M 434 117 L 461.5 117 L 463 118.5 L 465 126.5 L 467 129.5 L 475 155.5 L 477 158.5 L 485 184.5 L 487 187.5 L 496 216 L 473.5 216 L 472 214.5 L 466 194 L 431.5 194 L 430 195.5 L 424 216 L 400 215.5 L 434 117 Z M 449 142 L 447 144 L 439 168 L 439 171 L 437 175 Q 437 177 438 177 L 460 177 L 449 142 Z ',
  'M 507 117 L 528.5 117 L 529 117.5 L 529 198 L 571 198 L 571 216 L 507 216 L 507 117 Z ',
  'M 584 117 L 605.5 117 L 606 117.5 L 606 198 L 648 198 L 648 216 L 584 216 L 584 117 Z ',
  'M 661 117 L 727.5 117 L 728 117.5 L 728 135 L 683 135 L 683 157 L 725 157 L 725 176 L 683 176 L 683 198 L 728 198 L 728 216 L 661 216 L 661 117 Z ',
  'M 786.5 115 Q 790.5 114 791.5 116 L 799.5 116 L 800.5 117 L 806.5 118 L 818.5 125 L 823 129.5 L 830 141.5 L 831 144.5 L 831 150 L 809.5 150 L 809 148.5 Q 807.1 142.4 802.5 139 L 797.5 136 Q 794.3 136.7 793.5 135 L 784.5 135 L 778.5 137 L 770 144.5 L 765 155.5 Q 766.3 160.3 764 161.5 L 764 171.5 Q 766.3 172.8 765 177.5 L 769 187.5 L 776.5 195 L 783.5 198 L 795.5 198 L 806 193 L 806 191.5 L 810 186.5 L 811 179 L 790 179 L 790 163 L 832 163 L 832 184.5 L 831 185.5 L 830 192.5 L 827 198.5 L 816.5 210 L 807.5 215 L 801.5 216 L 800.5 217 Q 795.8 215.7 794.5 218 L 783.5 218 L 782.5 217 L 773.5 216 L 764.5 212 L 758.5 208 L 753 202.5 L 745 188.5 L 745 185.5 L 743 180.5 L 743 175.5 L 742 174.5 L 742 158.5 L 743 157.5 L 744 148.5 L 748 138.5 Q 752.9 129.9 760.5 124 L 771.5 118 L 777.5 117 L 778.5 116 L 785.5 116 L 786.5 115 Z ',
  'M 847 117 L 895.5 117 L 908.5 122 L 916 128.5 L 920 135.5 L 921 141.5 L 922 142.5 L 922 156.5 L 918 167.5 L 909.5 176 L 906 177 L 906 179.5 L 910 187.5 L 912 189.5 L 916 198.5 L 918 200.5 Q 920.9 209.1 926 215.5 L 901 216 L 899 210.5 L 897 208.5 L 891 195.5 L 889 193.5 L 882.5 181 L 869 181 L 869 216 L 847 216 L 847 117 Z M 869 135 L 869 164 L 886 164 L 895 161 L 898 158 L 900 152 L 900 148 L 898 142 L 894 137 L 888 135 L 869 135 Z ',
  'M 978.5 115 L 991.5 116 L 992.5 117 L 998.5 118 L 1009.5 124 L 1017 131.5 L 1020 135.5 L 1026 149.5 Q 1025 153.5 1027 154.5 L 1027 178.5 L 1026 179.5 L 1026 183.5 L 1024 189.5 L 1020 197.5 L 1009.5 209 L 1003.5 213 L 1001.5 213 L 992.5 217 L 986.5 217 L 985.5 218 L 975.5 218 L 974.5 217 L 969.5 217 L 968.5 216 L 962.5 215 Q 952.8 210.8 946 203.5 L 941 196.5 L 936 184.5 L 935 175.5 L 934 174.5 L 934 159.5 L 935 158.5 L 935 152.5 Q 936.8 151.8 936 148.5 L 941 136.5 L 953.5 123 L 960.5 119 L 966.5 117 Q 969.8 117.8 970.5 116 L 977.5 116 L 978.5 115 Z M 977 135 L 969 138 L 961 146 L 957 156 L 957 162 L 956 163 L 957 178 L 961 188 L 964 192 L 969 195 L 976 198 L 987 198 L 994 195 L 1000 189 L 1005 176 L 1005 158 L 1004 157 L 1003 151 L 999 144 L 992 137 L 986 135 L 977 135 Z ',
  'M 1100.5 116 L 1148.5 116 L 1152 118.5 L 1152 216.5 L 1150.5 218 L 1133.5 218 L 1131 215.5 L 1131 138.5 L 1129.5 137 L 1091.5 137 L 1088 139.5 L 1087 141.5 L 1087 216.5 L 1085.5 218 L 1067.5 218 L 1066 216.5 L 1066 133.5 L 1069.5 130 L 1084.5 130 L 1096.5 118 L 1100.5 116 Z ',
  'M 1169.5 117 L 1192.5 117 L 1193 118.5 L 1215.5 148 Q 1218.5 148.5 1219 146.5 L 1240 118.5 L 1240 117 L 1263.5 117 L 1265 118.5 L 1265 120.5 L 1225 173.5 L 1235.5 174 L 1240 178.5 L 1264 210.5 L 1266 213.5 L 1266 215.5 L 1264.5 217 L 1241 217 L 1241 215.5 L 1217.5 185 L 1214 187.5 L 1193 215.5 L 1193 217 L 1169.5 217 L 1168 215.5 L 1168 213.5 L 1201 170.5 L 1203 166.5 L 1170 123.5 L 1168 120.5 L 1168 118.5 L 1169.5 117 Z ',
];

const TEXT_ITEMS = [
  'Scroll Events page',
  'Import Framework',
  'Import header and footer',
  'Import content area',
  'Creating a Content Area',
];

const THEME_WORDS = ['Apply', 'a', 'variety', 'of', 'theme', 'colors'];

const LDC_IMAGES = ['ldcdbg01.png', 'ldcdbg02.png', 'ldcdbg03.png', 'ldcdbg04.png'];

const THEME_IMAGES = [
  'theme01.png', 'theme01_1.png', 'theme02.png', 'theme02_1.png',
  'theme03.png', 'theme03_1.png', 'theme04.png', 'theme04_1.png',
  'theme05.png', 'theme05_1.png', 'theme06.png', 'theme06_1.png',
];

const TITLE_LINES = [
  '1. 코드 간소화. 고도화 작업.',
  '2. 동영상 제작',
  '3. 디자인 적용해보기.',
  '4. 리액트 프레임워크에 넣어 보기.⚛️',
  '❣️ https://eutcomponent-react.vercel.app/',
  '❣️ https://scrollevent.vercel.app/',
];

function mapRange(p, start, end) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

function getSectionScrollPercent(el, scrollTop, windowHeight) {
  if (!el) return 0;
  const realHeight = el.offsetHeight - windowHeight;
  if (realHeight <= 0) return 0;
  const percent = ((scrollTop - el.offsetTop) / realHeight) * 100;
  return Math.max(0, Math.min(100, percent));
}

function buildTitleHtml(progress) {
  const totalLength = TITLE_LINES.join('').length;
  const currentLength = Math.floor(Math.min(progress, 1) * totalLength);
  let result = '';
  let count = 0;

  for (let i = 0; i < TITLE_LINES.length; i++) {
    const str = TITLE_LINES[i];
    if (count + str.length < currentLength) {
      result += str + '<br>';
      count += str.length;
    } else {
      result += str.slice(0, currentLength - count);
      break;
    }
  }
  return result;
}

function computeLayerClip(scrollPercent4, index, layerCount) {
  const segSize = 100 / layerCount;
  const globalSpin = (scrollPercent4 / 100) * 360;
  const angleStep = 360 / layerCount;
  const segStart = index * segSize;
  const segEnd = (index + 1) * segSize;

  if (scrollPercent4 < segStart) return 'circle(0% at 50% 50%)';
  if (scrollPercent4 >= segEnd) return 'circle(150% at 50% 50%)';

  const radius = mapRange(scrollPercent4, segStart, segEnd) * 95;
  const angleDeg = globalSpin + index * angleStep;
  const rad = (angleDeg * Math.PI) / 180;
  const cx = 50 + 32 * Math.cos(rad);
  const cy = 50 + 32 * Math.sin(rad);
  return `circle(${radius}% at ${cx.toFixed(1)}% ${cy.toFixed(1)}%)`;
}

export default function ScrollPage({ assetBase = '' }) {
  const imgBase = `${assetBase}img/`;
  const videoSrc = `${assetBase}video/testvideo.mp4`;

  const sectionRefs = useRef([]);
  const pathRefs = useRef([]);
  const videoRef = useRef(null);
  const logoPathsReady = useRef(false);
  const ticking = useRef(false);

  const [percents, setPercents] = useState([0, 0, 0, 0, 0, 0]);
  const [textActive, setTextActive] = useState([true, false, false, false, false]);
  const [imgStyles, setImgStyles] = useState([
    { left: '100%' },
    { left: '100%' },
    { left: '100%' },
    { left: '0%', opacity: 0 },
  ]);
  const [logoWrap, setLogoWrap] = useState({ opacity: 0, offscreen: false });
  const [themeOpacities, setThemeOpacities] = useState([0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
  const [layerClips, setLayerClips] = useState(() =>
    THEME_IMAGES.map(() => 'circle(0% at 50% 50%)')
  );
  const [section5Opacity, setSection5Opacity] = useState(0);
  const [titleHtml, setTitleHtml] = useState('');

  useLayoutEffect(() => {
    if (logoPathsReady.current) return;
    pathRefs.current.forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len},${len}`;
      path.style.strokeDashoffset = `${len}`;
    });
    logoPathsReady.current = true;
  }, []);

  useEffect(() => {
    const initLogoPaths = () => {
      if (logoPathsReady.current) return;
      pathRefs.current.forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len},${len}`;
        path.style.strokeDashoffset = `${len}`;
      });
      logoPathsReady.current = true;
    };

    const updateLogoSvg = (scrollPercent0) => {
      initLogoPaths();
      const appearStart = 5;
      const appearEnd = 95;
      const paths = pathRefs.current.filter(Boolean);
      const step = (appearEnd - appearStart) / paths.length;

      paths.forEach((path, i) => {
        const len = path.getTotalLength();
        const startPercent = appearStart + step * i;
        const endPercent = appearStart + step * (i + 1);

        if (scrollPercent0 >= endPercent) {
          path.style.strokeDashoffset = '0';
        } else if (scrollPercent0 >= startPercent) {
          const progress = Math.max(
            0,
            Math.min(1, (scrollPercent0 - startPercent) / (endPercent - startPercent))
          );
          path.style.strokeDashoffset = `${len * (1 - progress)}`;
        } else {
          path.style.strokeDashoffset = `${len}`;
        }
      });

      if (scrollPercent0 >= 100) {
        setLogoWrap({ opacity: 0, offscreen: true });
      } else if (scrollPercent0 < appearStart) {
        setLogoWrap({ opacity: 0, offscreen: false });
      } else {
        setLogoWrap({ opacity: 1, offscreen: false });
      }
    };

    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const p = sectionRefs.current.map((el) =>
        getSectionScrollPercent(el, scrollTop, windowHeight)
      );
      setPercents(p);

      const [p0, p1, p2, p3, p4, p5] = p;
      updateLogoSvg(p0);

      const thresholds = [21, 44, 70, 94];
      setTextActive(TEXT_ITEMS.map((_, i) => (i === 0 ? true : p1 > thresholds[i - 1])));

      const nextImgStyles = [
        { left: '100%' },
        { left: '100%' },
        { left: '100%' },
        { left: '0%', opacity: 0 },
      ];

      if (p1 >= 27) nextImgStyles[0] = { left: '0%' };
      if (p1 >= 50) nextImgStyles[1] = { left: '0%' };
      if (p1 >= 75) nextImgStyles[2] = { left: '0%' };

      if (p1 >= 5 && p1 < 27) {
        let mapped0 = 100 - ((p1 - 5) / (27 - 5)) * 110;
        if (mapped0 <= 10) mapped0 = 0;
        else if (mapped0 >= 90) mapped0 = 100;
        nextImgStyles[0] = { left: `${Math.round(mapped0)}%` };
      }
      if (p1 >= 27 && p1 < 50) {
        let mapped1 = 100 - ((p1 - 27) / (50 - 27)) * 110;
        if (mapped1 <= 10) mapped1 = 0;
        else if (mapped1 >= 90) mapped1 = 100;
        nextImgStyles[1] = { left: `${Math.round(mapped1)}%` };
      }
      if (p1 >= 50 && p1 < 75) {
        let mapped2 = 100 - ((p1 - 50) / (75 - 50)) * 110;
        if (mapped2 <= 10) mapped2 = 0;
        else if (mapped2 >= 90) mapped2 = 100;
        nextImgStyles[2] = { left: `${Math.round(mapped2)}%` };
      }
      if (p1 >= 75) {
        let mapped3 = (p1 - 75) / (100 - 75);
        if (mapped3 <= 0.2) mapped3 = 0;
        else if (mapped3 >= 0.8) mapped3 = 1;
        nextImgStyles[3] = { left: '0%', opacity: mapped3 };
      }
      setImgStyles(nextImgStyles);

      if (p2 >= 0 && p2 < 100 && videoRef.current) {
        videoRef.current.currentTime = Math.round(((p2 / 100) * 15) * 10) / 10;
      }

      const themeThresholds = [16, 32, 48, 64, 80, 96];
      setThemeOpacities(THEME_WORDS.map((_, idx) => (p3 >= themeThresholds[idx] ? 1 : 0.1)));

      setLayerClips(THEME_IMAGES.map((_, i) => computeLayerClip(p4, i, THEME_IMAGES.length)));

      setSection5Opacity(p5 >= 1 ? 1 : 0);
      setTitleHtml(buildTitleHtml(p5 / 100));

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div className="scroll-page">
      <div className="number">
        {percents.map((p, i) => (
          <div key={i}>{p.toFixed(0)}%</div>
        ))}
      </div>

      <div className="section section0" ref={setSectionRef(0)}>
        <div className="svgWrap">
          <div
            className={`logo_svg_wrap${logoWrap.offscreen ? ' offscreen' : ''}`}
            style={{ opacity: logoWrap.offscreen ? 0 : logoWrap.opacity }}
          >
            <svg
              className="logo_svg"
              width="400"
              height="100"
              viewBox="0 0 1334 334"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {LOGO_PATHS.map((d, i) => (
                <path
                  key={i}
                  ref={(el) => { pathRefs.current[i] = el; }}
                  d={d}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="section section1" ref={setSectionRef(1)}>
        <div className="textBox">
          {TEXT_ITEMS.map((text, i) => (
            <p key={i} className={`text${i}${textActive[i] ? ' active' : ''}`}>
              {text}
            </p>
          ))}
        </div>
        <div className="boxWrap">
          {LDC_IMAGES.map((name, i) => (
            <img key={name} src={`${imgBase}${name}`} alt="" style={imgStyles[i]} />
          ))}
        </div>
      </div>

      <div className="section section2" ref={setSectionRef(2)}>
        <div className="videoWrap">
          <video
            ref={videoRef}
            className="scrollVideo"
            src={videoSrc}
            muted
            preload="auto"
            playsInline
          />
        </div>
      </div>

      <div className="section section3" ref={setSectionRef(3)}>
        <div className="themeBoxtitle">
          {THEME_WORDS.map((word, i) => (
            <span key={word + i} style={{ opacity: themeOpacities[i] }}>
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="section section4" ref={setSectionRef(4)}>
        <div className="layer-sticky">
          <div className="layer-stack">
            {THEME_IMAGES.map((name, i) => (
              <div key={name} className="layer-card" style={{ clipPath: layerClips[i] }}>
                <img src={`${imgBase}${name}`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section5" ref={setSectionRef(5)}>
        <div className="titleTextWrap" style={{ opacity: section5Opacity }}>
          <div>
            <p className="titleText">3차 리뷰때 추가할 일</p>
            <p
              className="titleTextContent"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
