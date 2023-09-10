<script lang="ts">
  import { onMount } from "svelte";
  import {
    Button,
    Modal,
    Tabs,
    TabItem,
    Label,
    Input,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
  } from "flowbite-svelte";
  import AddingTextForm from "./components/AddingTextForm.svelte";
  import { AddingMode } from "./types/index";
  import * as processor from "./utils/processor";
  import { renameFile } from "./utils/network";

  interface AliyunDriveFile {
    drive_id: string;
    file_id: string;
    name: string;
  }

  let isShowingRenameModal = false;
  let isShowingSelectFileModal = false;
  let searchText: string;
  let replaceText: string = "";
  let exampleInput: string;
  $: exampleText = isReplaceMode
    ? processor.replace({ orgText: exampleInput, searchText, replaceText })
    : processor.adding({ orgText: exampleInput, addingText, addingMode });
  let isLoading = false;

  let isReplaceMode = true;
  let addingText: string = "";
  let addingMode: AddingMode = AddingMode.Before;

  let selectedFileIds: string[] = [];

  let site: "aliyun" | "kuake" = window.location.host === "www.aliyundrive.com" ? "aliyun" : "kuake";

  let aliyundriveFileList: AliyunDriveFile[] = [];

  if (site === "aliyun") {
    console.log("[vite-plugin-monkey] site....", window);

    onMount(() => {
      const originalSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.send = function (data) {
        this.addEventListener("load", function (event) {
          if (this.status == 200) {
            const responseURL = this.responseURL;
            if (responseURL.indexOf("/file/list") > 0) {
              var response = this.response;
              try {
                response = JSON.parse(response);
              } catch (error) {}
              console.log("[vite-plugin-monkey] response:", response);
              aliyundriveFileList = response.items as AliyunDriveFile[];
              if (aliyundriveFileList) {
                setTimeout(() => {
                  showRenameButton();
                }, 200);
              }
            }
          }
        });

        // 调用原始的 send 方法
        originalSend.call(this, data);
      };
    });
  }

  // 监听表格选中事件
  window.addEventListener("load", () => {
    site === "kuake" &&
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
    if (site === "kuake") {
      const selectedFileIds = getSelectedItems();
      if (selectedFileIds.length == 0) {
        return;
      }
    }

    const btnGroup = document.querySelector(site === "kuake" ? ".btn-operate .ant-btn-group" : "#root header");
    const isExist = btnGroup.querySelector("#renameBtn");
    if (isExist) {
      return;
    }

    const renameBtn = document.createElement("button");
    renameBtn.id = "renameBtn";
    renameBtn.className = "ant-btn btn-file w-300";
    renameBtn.innerHTML = "批量重命名";
    renameBtn.addEventListener("click", () => {
      console.log("[vite-plugin-monkey] rename click");

      if (site === "aliyun") {
        showSelectFileModal();
      } else {
        showDialog();
      }
    });
    btnGroup.appendChild(renameBtn);
  }

  function showSelectFileModal() {
    isShowingSelectFileModal = true;
  }

  // 显示重命名弹窗
  function showDialog() {
    isShowingRenameModal = true;

    if (site === "kuake") {
      const selectedItems = getSelectedItems();
      exampleInput = selectedItems?.[0]?.fileName;
    } else {
      console.log("[vite-plugin-monkey] select files:", selectedFileIds);
      exampleInput = aliyundriveFileList.find((item) => selectedFileIds.includes(item.file_id)).name;
    }
  }

  async function rename() {
    if (site === "kuake") {
      for (const item of getSelectedItems()) {
        const newFileName = process(item.fileName);
        if (!newFileName || newFileName === item.fileName) {
          continue;
        }
        await renameFile(site, item.fileId, newFileName, null);
      }
    } else {
      selectedFileIds.forEach((fileId) => {
        const file = aliyundriveFileList.find((item) => item.file_id === fileId);
        const newFileName = process(file.name);
        if (!newFileName || newFileName === file.name) {
          return;
        }
        renameFile(site, fileId, newFileName, file.drive_id);
      });
    }
  }

  // 提交重命名请求
  async function submit() {
    console.log("[vite-plugin-monkey] submit");
    console.log({ findText: searchText, replaceText });

    isLoading = true;

    await rename();

    isLoading = false;
    isShowingRenameModal = false;

    // 刷新当前页面
    window.location.reload();
  }

  function process(orgText) {
    console.log("[vite-plugin-monkey] process", { orgText, searchText, replaceText, addingText, addingMode });

    if (isReplaceMode) {
      if (!searchText || searchText.length === 0) {
        return null;
      }
    } else {
      if (!addingText || addingText.length === 0) {
        return null;
      }
    }

    return isReplaceMode
      ? processor.replace({ orgText, searchText, replaceText })
      : processor.adding({ orgText, addingText, addingMode });
  }
</script>

<Modal title="选择文件" bind:open={isShowingSelectFileModal}>
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell class="w-4">
        <Checkbox
          on:change={(e) => {
            // @ts-ignore
            const cheked = e.target.checked;
            cheked ? (selectedFileIds = aliyundriveFileList.map((item) => item.file_id)) : (selectedFileIds = []);
          }}
        />
      </TableHeadCell>
      <TableHeadCell>文件名称</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each aliyundriveFileList as file}
        <TableBodyRow>
          <TableBodyCell>
            <Checkbox bind:group={selectedFileIds} value={file.file_id} />
          </TableBodyCell>
          <TableBodyCell>{file.name}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  <svelte:fragment slot="footer">
    <Button
      color="blue"
      on:click={() => {
        isShowingSelectFileModal = false;
        showDialog();
      }}
      disabled={selectedFileIds.length === 0}
    >
      继续
    </Button>
    <Button color="alternative" on:click={() => (isShowingSelectFileModal = false)}>取消</Button>
  </svelte:fragment>
</Modal>

<Modal title="批量重命名" bind:open={isShowingRenameModal}>
  <div>
    <Tabs>
      <TabItem bind:open={isReplaceMode} title="替换文本">
        <div class="space-y-4">
          <div>
            <Label for="default-input" class="block mb-2">查找</Label>
            <Input id="default-input" required bind:value={searchText} />
          </div>
          <div>
            <Label for="first_name" class="mb-2">替换成</Label>
            <Input type="text" id="first_name" required bind:value={replaceText} />
          </div>
        </div>
      </TabItem>
      <TabItem title="添加文本">
        <AddingTextForm bind:addingMode bind:addingText />
      </TabItem>
    </Tabs>
    <div class="mt-5">示例：{exampleText}</div>
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
