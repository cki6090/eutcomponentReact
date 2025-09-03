export const menuLayoutList = [
  {
    id: 0,
    title: "해더",
    link: "header",
    image: "/header.jpg",
  },
  {
    id: 1,
    title: "해더 + 푸터",
    link: "headerfooter",
    image: "/headerfooter.jpg",
  },
  {
    id: 2,
    title: "해더 + 메인",
    link: "headermain",
    image: "/headermain.jpg",
  },
  {
    id: 3,
    title: "해더 + 메인 + 푸터",
    link: "headermainfooter",
    image: "/headermainfooter.jpg",
  },
];

export const layoutContents = [
  {
    id: 0,
    title: "header",
    like: 15,
    code: `
    <header></header>
    `,
  },
  {
    id: 1,
    title: "headerfooter",
    like: 2,
    code: `
    <header></header>
    <footer>
      <div className="footer-menu">
          <ul>
              <li>
                  <button>메뉴1</button>
                  <button>메뉴2</button>
                  <button>메뉴3</button>
              </li>
              <li>
                  <button>메뉴2</button>
                  <button>메뉴3</button>
                  <button>메뉴4</button>
              </li>
          </ul>
      </div>
    </footer>
    `,
  },
  {
    id: 2,
    title: "headermain",
    like: 2,
    code: `
    <header></header>
    <main></main>
    `,
  },
  {
    id: 3,
    title: "headermainfooter",
    like: 3,
    code: `
    <header></header>
    <main></main>
    <footer></footer>
    `,
  },
];

export const comment = {
  header: [
    {
      content: "header 좀 더 추가해주세요",
      date: "2025-08-21",
    },
  ],
  headerfooter: [
    {
      content: "headerfooter 좀 더 추가해주세요",
      date: "2025-08-21",
    },
  ],
  headermain: [
    {
      content: "headermain 좀 더 추가해주세요",
      date: "2025-08-21",
    },
  ],
  headermainfooter: [
    {
      content: "headermainfooter 좀 더 추가해주세요",
      date: "2025-08-21",
    },
  ],
};
