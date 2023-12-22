import classNames from "classnames";
import Aside from "../components/Aside.jsx";
export default function Layout({ children }){



    return (
        <div className={classNames({
            "min-h-screen": true,
        })}>
            <Aside/>
            <main className="lg:pl-80 py-10">
                { children }
            </main>
        </div>
    );
}