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

      <table className="table">
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "" }} />
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
              <input type="text" />
            </td>

            <th>
              <span>checkbox</span>
            </th>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
