<script lang="ts">

export default {};

type itemValueShouldBe = {
  lastName?: string | undefined,
  firstName?: string | undefined,
  amount?: string | undefined,
};
</script>

<script setup lang="ts" generic="
  VeeValidatePath extends string,
  TDefinition extends DefinitionConstraint<VeeValidatePath, itemValueShouldBe>,
  TOutput
">
import type { FormContext, Path } from 'vee-validate'
import useObjectArrayField, {type DefinitionConstraint} from './ObjectArrayField/useObjectArrayField'
import { computed } from 'vue';

const props = defineProps<{
  objectArrayFieldPath: Path<TDefinition> & VeeValidatePath,
  namePrefix : string,
  index: number,
  itemValue: itemValueShouldBe,
  context: FormContext<TDefinition, TOutput>,
}>()

const refVeeValidatePath = computed(() => props.objectArrayFieldPath)
const refIndex = computed(() => props.index)

const lastNameObjs = useObjectArrayField(props.itemValue, props.context, refVeeValidatePath, refIndex, 'lastName')
const firstNameObjs = useObjectArrayField(props.itemValue, props.context, refVeeValidatePath, refIndex, 'firstName')
const amountObjs = useObjectArrayField(props.itemValue, props.context, refVeeValidatePath, refIndex, 'amount')


</script>

<template>
  <td>
    <div>
      <VTextField
        label="last name"
        :name="`${namePrefix}[${index}]lastName`"
        v-model="lastNameObjs[0].value"
        v-bind="lastNameObjs[1].value"
        maxlength="20"
      />
    </div>
  </td>
  <td>
    <div>
      <VTextField
        label="first name"
        :name="`${namePrefix}[${index}]firstName`"
        v-model="firstNameObjs[0].value"
        v-bind="firstNameObjs[1].value"
        maxlength="20"
      />
    </div>
  </td>
  <td>
    <div>
      <VTextField
        label="last name"
        :name="`${namePrefix}[${index}]amount`"
        v-model="amountObjs[0].value"
        v-bind="amountObjs[1].value"
        maxlength="5"
      />
    </div>
  </td>
</template>