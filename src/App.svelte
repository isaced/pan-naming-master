<script lang="ts">
  window.addEventListener("load", () => {
    document.querySelector(".ant-table-tbody").addEventListener("click", (e) => {
      setTimeout(() => {
        showRenameButton();
      }, 300);
    });
  });

  function getSelectedItems() {
    const fileIds: string[] = [];
    document.querySelectorAll(".ant-table-row-selected").forEach((el) => {
      const fileId = el.getAttribute("data-row-key");
      fileIds.push(fileId);
    });
    console.log("[vite-plugin-monkey] selected:", fileIds);
    return fileIds;
  }

  function showRenameButton() {
    const selectedFileIds = getSelectedItems();
    if (selectedFileIds.length > 0) {
      const btnGroup = document.querySelector(".btn-operate .ant-btn-group");
      const renameBtn = document.createElement("button");
      renameBtn.className = "ant-btn btn-file";
      renameBtn.innerHTML = "批量重命名";
      renameBtn.addEventListener("click", () => {
        console.log("[vite-plugin-monkey] rename:", selectedFileIds);
      });
      btnGroup.appendChild(renameBtn);
    }
  }
</script>

<div class="aaa">hello~12</div>

<style>
  .aaa {
    color: #888;
  }
</style>
