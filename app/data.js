export const menuLayoutList = [
  {
    id: 0,
    title: "검색",
    link: "search",
    like: 0,
  },
  {
    id: 1,
    title: "검색 + 푸터",
    link: "search-footer",
    like: 0,
  },
  {
    id: 2,
    title: "검색 + 콘텐츠",
    link: "search-content",
    like: 1,
  },
];

export const layoutContents = [
  {
    id: 0,
    title: "search",
    image: "이미지1",
    code: `
    <header>헤더</header>`,
  },
  {
    id: 1,
    title: "search-footer",
    image: "이미지2",
    code: `
    <header>헤더</header>

    <footer>
        <div class="footer-menu">
            <ul>
                <li>
                    <button>버튼1</button>
                    <button>버튼2</button>
                </li>
                <li>
                    <button>버튼1</button>
                    <button>버튼2</button>
                </li>
            </ul>
        </div>
    </footer>`,
  },
  {
    id: 2,
    title: "search-content",
    image: "이미지3",
    code: `
    <header>헤더</header>
    <main>메인</main>`,
  },
];
