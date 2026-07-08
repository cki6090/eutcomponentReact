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


export const mainSectionContents = [
{
    title: "Column 1/1",
    zone:"main",
    target: "section",
    code: `
        <div className="main-section-Column main-section-1Column">
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
},
{
    title: "Column 1/2",   
    zone:"main",
    target: "section",
    code: `
        <div className="main-section-Column main-section-2Column">
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
},
{
    title: "Column 1/3",
    zone:"main",
    target: "section",
    code: `
        <div className="main-section-Column main-section-3Column"> 
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>  
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
},
{
    title: "Column 1/4",
    zone:"main",
    target: "section",
    code: `
        <div className="main-section-Column main-section-4Column">
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>    

            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="main-section-Column-Item">
                <div className="table-pnl">
                    <table>
                        <tbody>
                            <tr>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
},
];

export const mainContents = [
    {
        title: "타이틀 + 인풋",
        zone:"main",
        target: "tr",
        code: `
        <th class="th-title">
            <span class="th-title-label">제목작성</span>
            <input type="text" class="th-title-input" placeholder="제목 작성" />
        </th>
        <td>  
            <div className="main-item-input">
                <input type="text" />
            </div>
        </td>
        `,
    },
    {
        title: "인풋",
        zone:"main",
        target: "tr",
        code: `
        <td>  
            <div className="main-item-input">
                <input type="text" />
            </div>
        </td>
        `,
    },
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