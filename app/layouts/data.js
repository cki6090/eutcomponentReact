export const menuLayoutList = [
  {
    id: 0,
    title: "해더",
    link: "header",
    image: "/header.jpg",
    like: 7,
  },
  {
    id: 1,
    title: "해더 + 푸터",
    link: "headerfooter",
    image: "/headerfooter.jpg",
    like: 2,
  },
  {
    id: 2,
    title: "해더 + 메인",
    link: "headermain",
    image: "/headermain.jpg",
    like: 1,
  },
  {
    id: 3,
    title: "해더 + 메인 + 푸터",
    link: "headermainfooter",
    image: "/headermainfooter.jpg",
    like: 1,
  },
];

export const layoutContents = [
  {
    id: 0,
    title: "header",
    code: `
    <header></header>
    `,
  },
  {
    id: 1,
    title: "headerfooter",
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
    code: `
    <header></header>
    <main></main>
    `,
  },
  {
    id: 3,
    title: "headermainfooter",
    code: `
    <header></header>
    <main></main>
    <footer></footer>
    `,
  },
];
