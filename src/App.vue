<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import ObjectArrayField from './components/ObjectArrayField/ObjectArrayField.vue';
import PeopleDetailItemRow from './components/PeopleDetailItemRow.vue';


// フォームデータ定義
const formContext = useForm({
  // 入力検証
  validationSchema: toTypedSchema(yup.object({
    sample: yup.array().ensure()
      .of(yup.object({
        lastName: yup.string().required(),
        firstName: yup.string().required(),
        amount: yup.string().required(),
      })).required(),
      note: yup.string(),
  })),
  // 初期値
  initialValues: {
    sample: [
      {
        lastName: '',
        firstName: '',
        amount: '3',
      }
    ],
    note: '',
  }
})

// ObjectArrayField初期値用
const generateItem = () => ({
  lastName: '',
  firstName: '',
  amount: '3',
})


</script>

<template>
  <VApp>
    <VMain>
      <form>
        <!-- ObjectArrayField -->
        <ObjectArrayField
          namePrefix="foo"
          objectArrayFieldPath="sample"
          :context="formContext"
          :generateItem="generateItem"
          :fieldCellColumns="3"
        >
          <template #header>
            <th>
              Last Name
            </th>
            <th>
              First Name
            </th>
            <th>
              Amount
            </th>
          </template>
          <template #item="itemSlotProps">
            <PeopleDetailItemRow
              v-bind="itemSlotProps"
              :context="formContext"
            />
          </template>
        </ObjectArrayField>
        <!-- other input field -->
        <VTextField label="備考" name="note" />
      </form>
    </VMain>
  </VApp>
</template>

