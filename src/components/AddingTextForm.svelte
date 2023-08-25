<script lang="ts">
  import { Label, Input, Radio } from "flowbite-svelte";
  import { AddingMode } from "../types";

  export let addingText: string;
  export let addingMode: AddingMode;
</script>

<div class="space-y-4">
  <div>
    <Label for="default-input" class="block mb-2">添加文本</Label>
    <Input id="default-input" required bind:value={addingText} />
  </div>
  <div>
    <Label for="first_name" class="mb-2">位置</Label>
    <div class="flex gap-4">
      <Radio bind:group={addingMode} value={AddingMode.Before}>名称之前</Radio>
      <Radio bind:group={addingMode} value={AddingMode.After}>名称之后</Radio>
    </div>
  </div>
  <!-- <div>示例：{exampleText}</div> -->
</div>
