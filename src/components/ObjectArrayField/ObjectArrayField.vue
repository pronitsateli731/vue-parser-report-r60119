
<script setup lang="ts" generic="
  /** definition of data in FormContext */
  TDefinitionOfFormContext extends Record<string, unknown>,
  /** Output of FormContext */
  TOutputOfFormContext,
  /** Vee Validate Path of whole this component */
  TObjectArrayFieldPath extends Path<TDefinitionOfFormContext>,
  /** Row data type */
  TItemValue extends Item<PathValue<TDefinitionOfFormContext, TObjectArrayFieldPath>>
">
import { computed } from 'vue';
import { useFieldArray, type FormContext, type Path, type PathValue } from 'vee-validate'
import type { Item } from './useObjectArrayField';

const props = defineProps<{
  /**
   * name属性のprefix
   */
  namePrefix: string,
  /**
   * フォーム側で useForm() を用いて作ったコンテキスト
   */
  context: FormContext<TDefinitionOfFormContext, TOutputOfFormContext>,
  /**
   * フォームデータオブジェクト内の、本コンポーネントが使うフォームデータ配列が入っているプロパティ名
   * useFieldArray(××) の××に入れる文字列
   */
  objectArrayFieldPath: TObjectArrayFieldPath,
  /**
   * 入力初期データ生成関数
   */
  generateItem: () => TItemValue,
  /**
   * 入力列の数
   */
  fieldCellColumns: number,
}>();

// このコンポーネント全体のフォームデータ
const fieldArrayContext = useFieldArray<TItemValue>(props.objectArrayFieldPath)

// 配列全体部分のみのエラー
const tableErrors = computed(() => props.context.errorBag.value[props.objectArrayFieldPath])

const hasTableError = computed(() => {
  if (tableErrors.value === undefined) {
    return false;
  }
  return tableErrors.value.length > 0;
})

// 末尾に行追加
const pushItem = () => {
  fieldArrayContext.push(props.generateItem())
}
// 直前に行追加
const insertItem = (index: number) => {
  fieldArrayContext.insert(index, props.generateItem());
}
// 行削除
const removeItem = (index: number) => {
  fieldArrayContext.remove(index);
}

</script>

<template>
  <VTable
    :class="hasTableError ? 'ObjectArrayField ObjectArrayField--Invalid' : 'ObjectArrayField'"
  >
    <thead>
      <tr>
        <slot name="header"/>
        <td>
          <input
            type="hidden"
            :name="namePrefix"
            :value="fieldArrayContext.fields.value.length"
          />
          <VBtn prepend-icon="mdi-plus" @click="pushItem">最後尾に追加</VBtn>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(innerItem, index) in fieldArrayContext.fields.value"
        :index="index"
        :key="innerItem.key"
      >
        <slot
          name="item"
          :objectArrayFieldPath="objectArrayFieldPath"
          :namePrefix="namePrefix"
          :index="index"
          :itemValue="innerItem.value"
        />
        <td>
          <VBtn
            icon="mdi-minus"
            @click="removeItem(index)"
          />
          <VBtn
            icon="mdi-plus"
            @click="insertItem(index)"
          />
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td :colspan="fieldCellColumns + 1">
          <VInput :errorMessages="tableErrors" />
        </td>
      </tr>
    </tfoot>
  </VTable>
</template>

<style scoped>
.ObjectArrayField--Invalid{
  border: 2px solid rgv(var(--v-theme-error));
}
</style>