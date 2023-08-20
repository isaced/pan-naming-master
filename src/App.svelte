<script lang="ts">
  import { Button, Modal, Tabs, TabItem, Label, Input, Spinner } from "flowbite-svelte";

  let isShowingRenameModal = false;
  let searchText: string;
  let replaceText: string = "";
  let exampleInput: string;
  $: exampleText = searchText ? exampleInput.replace(searchText, replaceText) : exampleInput;
  let isLoading = false;

  // 监听表格选中事件
  window.addEventListener("load", () => {
    document.querySelector(".ant-table-tbody").addEventListener("click", (e) => {
      setTimeout(() => {
        showRenameButton();
      }, 100);
    });
  });

  // 获取选中的文件列表
  function getSelectedItems() {
    const items: { fileId: string; fileName: string }[] = [];
    document.querySelectorAll(".ant-table-row-selected").forEach((el) => {
      const fileId = el.getAttribute("data-row-key");
      const fileName = el.querySelector(".filename-text").textContent;
      items.push({ fileId, fileName });
    });
    console.log("[vite-plugin-monkey] selected:", items);
    return items;
  }

  // 显示重命名按钮
  function showRenameButton() {
    const selectedFileIds = getSelectedItems();
    if (selectedFileIds.length > 0) {
      const btnGroup = document.querySelector(".btn-operate .ant-btn-group");
      const isExist = btnGroup.querySelector("#renameBtn");
      if (isExist) {
        return;
      }

      const renameBtn = document.createElement("button");
      renameBtn.id = "renameBtn";
      renameBtn.className = "ant-btn btn-file w-300";
      renameBtn.innerHTML = "批量重命名";
      renameBtn.addEventListener("click", () => {
        console.log("[vite-plugin-monkey] rename:", selectedFileIds);
        showDialog();
      });
      btnGroup.appendChild(renameBtn);
    }
  }

  // 显示重命名弹窗
  function showDialog() {
    isShowingRenameModal = true;

    const selectedItems = getSelectedItems();
    exampleInput = selectedItems?.[0]?.fileName;
  }

  // 提交重命名请求
  async function submit() {
    console.log("[vite-plugin-monkey] submit");
    console.log({ findText: searchText, replaceText });

    isLoading = true;
    for (const item of getSelectedItems()) {
      if (!searchText || searchText.length === 0) {
        continue;
      }
      const newFileName = item.fileName.replace(searchText, replaceText);
      if (newFileName === item.fileName) {
        continue;
      }
      await renameFile(item.fileId, newFileName);
    }
    isLoading = false;
    isShowingRenameModal = false;

    // 刷新当前页面
    window.location.reload();
  }

  // 重命名单个文件
  function renameFile(fileId: string, fileName: string) {
    if (!fileId || !fileName || fileName.length === 0) {
      return;
    }
    return fetch("https://drive-pc.quark.cn/1/clouddrive/file/rename?pr=ucpro&fr=pc", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fid: fileId, file_name: fileName }),
    });
  }
</script>

<Modal title="批量重命名" bind:open={isShowingRenameModal}>
  <div>
    <Tabs>
      <TabItem open title="替换文本">
        <div class="space-y-4">
          <div>
            <Label for="default-input" class="block mb-2">查找</Label>
            <Input id="default-input" required bind:value={searchText} />
          </div>
          <div>
            <Label for="first_name" class="mb-2">替换成</Label>
            <Input type="text" id="first_name" required bind:value={replaceText} />
          </div>
          <div>示例：{exampleText}</div>
        </div>
      </TabItem>
    </Tabs>
  </div>
  <svelte:fragment slot="footer">
    <Button
      color="blue"
      on:click={() => {
        submit();
      }}
      disabled={isLoading}
    >
      {#if isLoading}
        <Spinner class="mr-3" size="4" color="white" />
      {/if}
      重新命名
    </Button>
    <Button color="alternative" on:click={() => (isShowingRenameModal = false)}>取消</Button>
  </svelte:fragment>
</Modal>
