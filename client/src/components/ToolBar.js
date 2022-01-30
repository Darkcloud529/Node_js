import React, { useContext } from "react";
import {  Link  } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Toolbar를 통해 다른 페이지 이동
// link를 활용해 새로 고침이 아닌 원페이지 내에서 이동
const ToolBar = () => {
    const [me, setMe] = useContext(AuthContext);
    return (
    <div>
        <Link to="/">
            <span> 홈 </span>
        </Link>
        {me ? 
        (<span style={{float:"right"}}>로그아웃</span>) : (
        <>
            <Link to="/auth/login">
                <span style={{float: "right"}}> 로그인 </span>
            </Link>
            <Link to="/auth/register">
                <span style={{float: "right", marginRight: "10px"}}> 회원가입 </span>
            </Link>
        </>
        )}
        
    </div>
    );
};

export default ToolBar;