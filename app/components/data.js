export const menuComponentList = [
  {
    id: 0,
    title: "검색",
    link: "search",
    image: "/search.jpg",
    like: 7,
  },
  {
    id: 1,
    title: "그리드",
    link: "grid",
    image: "/grid.jpg",
    like: 2,
  },
  {
    id: 2,
    title: "테이블",
    link: "table",
    image: "/table.jpg",
    like: 1,
  },
  {
    id: 3,
    title: "버튼",
    link: "button",
    image: "/button.jpg",
    like: 1,
  },
  {
    id: 4,
    title: "컬러",
    link: "color",
    image: "/color.jpg",
    like: 1,
  },
  {
    id: 5,
    title: "차트",
    link: "chart",
    image: "/chart.jpg",
    like: 1,
  },
];

export const componentContents = [
  {
    id: 0,
    title: "search",
    image: "/search.jpg",
    code: `
    <div className="search-pnl">
        <div className="search-input">
            <input type="text" />
            <label>카테고리</label>
        </div>
        <div className="search-input">
            <input type="text" />
            <label>달력</label>
            <img src="/date.svg" alt="search" />
        </div>
        <div className="search-input">
            <input type="text" />
            <label>코드</label>
            <img src="/file.svg" alt="search" />
        </div>
        <div className="search-input">
            <input type="text" />
            <label>검색</label>
            <img src="/search.svg" alt="search" />
        </div>
      
        <button className="button-search">검색</button>
    </div>`,
  },
  {
    id: 1,
    title: "grid",
    image: "/grid.png",
    code: `
    <div className="main-grid">
        <Grid/>
    </div>`,
  },
  {
    id: 2,
    title: "table",
    image: "이미지3",
    code: `
    <div className="main-table">
        <Table />
    </div>`,
  },
  {
    id: 3,
    title: "button",
    image: "이미지4",
    code: `
    <div>
        <div className="button-box-title">버튼</div>
        <div className="button-box">
            <button className="button-default">기본 버튼</button>
            <button className="button-default success">성공 버튼</button>
            <button className="button-default warning">경고 버튼</button>
            <button className="button-default error">오류 버튼</button>
        </div>

        <div className="button-box-title">토글</div>
        <div className="button-box">
            <div className="toggle-box">
            <input type="checkbox" id="toggle" hidden />
            <label htmlFor="toggle" className="toggleSwitch">
                <span className="toggleButton"></span>
            </label>
            </div>
        </div>

        <div className="button-box-title">체크박스</div>
        <div className="button-box">
            <div className="check-box">
            <label htmlFor="agree" className="chk_box">
                <input type="checkbox" id="agree" />
                <span className="on"></span>
            </label>
            </div>

            <div className="check-box">
            <label htmlFor="agree2" className="chk_box">
                <input type="checkbox" id="agree2" />
                <span className="on"></span>
            </label>
            </div>

            <div className="check-box">
            <label htmlFor="agree3" className="chk_box">
                <input type="checkbox" id="agree3" defaultChecked />
                <span className="on"></span>
                <span className="check-box-text">이용약관에 동의합니다.</span>
            </label>
            </div>
        </div>

        <div className="button-box-title">라디오</div>
        <div className="button-box">
            <div className="check-box">
            <label htmlFor="radio" className="chk_box">
                <input type="radio" id="radio" name="radio" />
                <span className="on"></span>
            </label>
            </div>
            <div className="check-box">
            <label htmlFor="radio2" className="chk_box">
                <input type="radio" id="radio2" name="radio" />
                <span className="on"></span>
            </label>
            </div>
            <div className="check-box">
            <label htmlFor="radio3" className="chk_box">
                <input type="radio" id="radio3" name="radio" defaultChecked />
                <span className="on"></span>
                <span className="check-box-text">이용약관에 동의합니다.</span>
            </label>
            </div>
        </div>
    </div>`,
  },
  {
    id: 4,
    title: "color",
    image: "이미지5",
    code: `
    <div className="color-box">
        <ul className="color-list">
            <li className="color-gray01"}>
            <p>#f5f5f5</p>
            </li>
            <li className="color-gray02">
            <p>#e5e5e5</p>
            </li>
            <li className="color-gray03">
            <p>#d5d5d5</p>
            </li>
            <li className="color-gray04">
            <p>#a3a3a3</p>
            </li>
            <li className="color-gray05">
            <p>#737373</p>
            </li>
            <li className="color-gray06">
            <p>#525252</p>
            </li>
            <li className="color-gray07">
            <p>#404040</p>
            </li>
            <li className="color-gray08">
            <p>#262626</p>
            </li>
        </ul>
    </div>`,
  },

  {
    id: 5,
    title: "chart",
    image: "이미지3",
    code: `
    <div className="main-chart">
        <Chart />
    </div>`,
  },
];
