export default function Home() {
  return (
    <div className="index-page">
      <div className="index-page-content">
        <h1>
          Project Name
          <br></br>
          <span>Component Page</span>
        </h1>
        <p>
          This page is a service that helps anyone create a homepage easily and{" "}
          <br></br>
          quickly. With an intuitive interface, you can immediately implement{" "}
          <br></br>
          the design you want.
        </p>
      </div>

      <div className="index-page-image">
        <ul className="thumbs">
          <li>
            <img src="/indeximg1.jpg" className="indeximg1" />
          </li>
          <li>
            <img src="/indeximg2.jpg" className="indeximg2" />
          </li>
          <li>
            <img src="/indeximg3.jpg" className="indeximg3" />
          </li>
        </ul>
      </div>
    </div>
  );
}
