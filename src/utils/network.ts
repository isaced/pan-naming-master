// 重命名单个文件
export function renameFile(
  site: "aliyun" | "kuake",
  fileId: string,
  fileName: string,
  driveId?: string,
) {
  if (!fileId || !fileName || fileName.length === 0) {
    return;
  }
  console.log(
    "[vite-plugin-monkey] renameFile",
    site,
    fileId,
    fileName,
    driveId,
  );

  if (site === "kuake") {
    return fetch(
      "https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid: fileId, file_name: fileName }),
      },
    );
  } else if (site === "aliyun") {
    //解析token
    let token = JSON.parse(getToken());
    if (!token) {
      alert("请先登录！");
      return;
    }
    let tokenStr = token.token_type + " " + token.access_token;
    console.log("[vite-plugin-monkey] update authorization:", tokenStr);

    return fetch(
      "https://api.aliyundrive.com/v3/file/update",
      {
        method: "POST",
        headers: {
          "authority": "api.aliyundrive.com",
          "authorization": tokenStr,
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          drive_id: driveId,
          file_id: fileId,
          name: fileName,
          check_name_mode: "refuse",
        }),
      },
    );
  }
}

function getToken() {
  let token = localStorage.getItem("token");
  if (isBlank(token)) {
    token = sessionStorage.getItem("token");
    if (isBlank(token)) {
      token = getCookie("token");
    }
  }

  return token;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function isBlank(str) {
  if (str == null || str === "") return true;
  else if (str.trim() === "") return true;
  else return false;
}
