export const headerContents = [
    {
        title: "search",
        zone:"header",
        code: `
            <div className="search-input">
                <input type="text" />
                <label> <input type="text" placeholder="제목을 작성해 주세요" /></label>
            </div>
            `,
    },
    {
        title: "calendar",
        zone:"header",
        code: `
            <div className="search-input">
                <input type="text" />
                <label>달력</label>
                <img src="/date.svg" alt="search" />
            </div>
        `,
    },
    {
        title: "file",
        zone:"header",
        code: `
            <div className="search-input">
                <input type="text" />
                <label>파일</label>
                <img src="/file.svg" alt="search" />
            </div>
        `,
    },
    {
        title: "search",
        zone:"header",
        code: `
            <div className="search-input">
                <input type="text" />
                <label>검색</label>
                <img src="/search.svg" alt="search" />
            </div>
        `,
    }

  ];


  export const mainContents = [
    {
        title: "main",
        zone:"main",
        code: `
            <h1>메인 영역</h1>
            <p>이곳은 메인 콘텐츠가 들어갑니다.</p>
        `,
    }
  ];

  export const footerContents = [     {
        title: "기본 버튼",
        zone:"footer",
        code: `
           <button className="button-default">버튼</button>
        `,
    },
    {
        title: "성공 버튼",
        zone:"footer",
        code: `
           <button className="button-default success">버튼</button>
        `,
    },
    {
        title: "경고 버튼",
        zone:"footer",
        code: `
           <button className="button-default warning">버튼</button>
        `
    } ,    
    {
        title: "오류 버튼",
        zone:"footer",
        code: `
           <button className="button-default error">버튼</button>
        `,
    }      
  ];