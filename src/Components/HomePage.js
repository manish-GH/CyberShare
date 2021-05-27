import { Header } from "./Header";
import { Timeline } from "./Timeline";
import { Sidebar } from "./Sidebar";

export default function HomePage() {
  return (
    <div className="home">
      <div className="sticky">
        <Header />
      </div>
      <div className="grid-container">
        <Timeline />
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
