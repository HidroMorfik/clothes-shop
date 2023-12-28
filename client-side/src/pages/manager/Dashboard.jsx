import Layout from "../../layouts/Layout.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import classNames from "classnames";

export default function Dashboard(){
    const [sess_id, setSess_id] = useState(sessionStorage.getItem("token") ? sessionStorage.getItem("token") : false);
    const [user, setUser] = useState(sessionStorage.getItem("user") ?  JSON.parse(sessionStorage.getItem("user")) : false);
    const navigate = useNavigate();
    const [backups, setBackups] = useState([]);
    const [backup, setBackup] = useState(0);
    const file_name = "backup_"+((new Date()).getTime())+".bak";

    useEffect(() => {
        if (user.role === "admin"){
            axios.get("/db/",{
                withCredentials: true,
                headers: {
                    sess_id
                }
            })
                .then((resp)=>{
                    setBackups(resp.data.data)
                })
                .catch((error)=>{
                    toast.error(error.response.data.message)
                })
        }
    }, [navigate]);


    const crate_backup = () => {
      axios.post("/db/backup",{
          sess_id,
          file_name
    })
          .then((resp)=>{
              toast.success(resp.data.message)
          })
          .catch((error)=>{
              toast.error(error.response.data.message)
          })
    }

    const restore = () => {
        if (backup !== 0){
            axios.post("/db/restore",{
                sess_id,
                backup
            })
                .then((resp)=>{
                    toast.success(resp.data.message)
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    navigate("/login");
                })
                .catch((error)=>{
                    toast.error(error.response.data.message)
                })
        }else{
            toast.error("Lütfen Yedek Seçin!")
        }
    }

    return(
        <Layout>
            <div className={classNames({
                "flex gap-10": user.role === "admin",
                "hidden" : user.role !== "admin",
            })}>
                 <button onClick={()=>{crate_backup()}} className="p-2 border border-red-500 bg-red-50 text-red-600 rounded-xl">
                     Yedekle
                 </button>

                <select onChange={({target}) => setBackup(target.value)}>
                    <option value="0" disabled selected>Yedek Seçiniz</option>
                    {backups && backups.map((backup) =>
                        <option key={backup.id} value={backup.file_name}>{backup.file_name} ({backup.created_at})</option>
                    )}
                </select>

                <button onClick={()=>{restore()}} className="p-2 border border-red-500 bg-red-50 text-red-600 rounded-xl">
                    Yedekten Dön
                </button>
            </div>
        </Layout>
    )
}