export default function Button() {
  return (
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
    </div>
  );
}
