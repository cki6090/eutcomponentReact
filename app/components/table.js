export default function Table() {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>나이</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>홍길동</td>
            <td>20</td>
          </tr>
        </tbody>
      </table>

      <br />
      <br />
      <br />

      <table className="table">
        <colgroup>
          <col style={{ width: "80px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "80px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "80px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <span>숫자</span>
            </th>
            <td>1</td>

            <th>
              <span>text</span>
            </th>
            <td>
              <input type="text" defaultValue="text" />
            </td>

            <th>
              <span>checkbox</span>
            </th>
            <td>
              <div className="button-box">
                <div className="check-box">
                  <label htmlFor="agree" className="chk_box">
                    <input type="checkbox" id="agree" />
                    <span className="on"></span>
                  </label>
                </div>
              </div>
            </td>

            <th>
              <span>radio</span>
            </th>
            <td>
              <div className="button-box">
                <div className="check-box">
                  <label htmlFor="radio2" className="chk_box">
                    <input type="radio" id="radio2" name="radio" />
                    <span className="on"></span>
                  </label>
                </div>

                <div className="check-box">
                  <label htmlFor="radio3" className="chk_box">
                    <input
                      type="radio"
                      id="radio3"
                      name="radio"
                      defaultChecked
                    />
                    <span className="on"></span>
                    <span className="check-box-text">
                      이용약관에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <br />
      <br />
    </div>
  );
}
