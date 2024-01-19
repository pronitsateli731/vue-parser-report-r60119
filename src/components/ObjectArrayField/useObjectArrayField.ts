import { type MaybeRef, type Ref, ref, toValue, watchEffect } from "vue";
import type { BaseFieldProps, FormContext, GenericObject, Path, PathValue } from "vee-validate";
import veeVuetifyConverter, { type VeeVuetifyConverterGenericObject } from "@/veeVuetifyConverter";


/**
 * return vee-validate Path of each Field inner ObjectArrayField
 * @param objectArrayFieldPath 
 * @param index 
 * @param itemPropertyName 
 * @returns 
 */
const getFieldPath = (objectArrayFieldPath: string, index: number, itemPropertyName: string) => `${objectArrayFieldPath}[${index}].${itemPropertyName}`

export type DefinitionConstraint<TObjectArrayFieldPath extends string, TObjectArrayFieldItemValue>
 = GenericObject & Partial<{ [key in TObjectArrayFieldPath] : TObjectArrayFieldItemValue[] | undefined }>



export type Item<TArray, TItemBase = unknown> = TArray extends TItemBase[] ? TArray[number] : never

/**
 * FormContext.defineField(○○, veeVuetifyConverter)
 * This is used when auto type inference can't guess.
 */
export type DefineFieldTuple<TFieldValue> = [Ref<TFieldValue>, Ref<BaseFieldProps & VeeVuetifyConverterGenericObject>]

export default function useObjectArrayField<
  /** 項目の行データ型。itemValueによって指定されて他の引数の制約条件となる */
  TItemValueShouldBe extends Record<string, unknown>,
  /** FormContextの持つフォーム定義のデータ形式 */
  TDefinitionOfFormContext extends Record<string, unknown> & { [key in string] : TItemValueShouldBe[] | undefined },
  /** FormContextの出力定義型（処理には使わない。FormContextのgenericとして必要） */
  TOutputOfFormContext,
  /** Vee Validate Path の文字列（ObjectArrayField 全体） */
  TObjectArrayFieldPath extends Path<TDefinitionOfFormContext>,
  /** 
   * ObjectArrayField の列データ型。正常な使い方であれば、TItemValueShouldBeと一致する。
   * FormContextに存在する保証のために、内部処理用に意図的に重複定義する。
   */
  TItemValue extends Item<PathValue<TDefinitionOfFormContext, TObjectArrayFieldPath>>,
  /** TItemValue の各プロパティの文字列を示す型 */
  TItemValueProperty extends string & keyof TItemValue,
  /** FormContext の Path型 */
  TPathOfFormContext extends Path<TDefinitionOfFormContext> = Path<TDefinitionOfFormContext>
>(
  itemValue: MaybeRef<TItemValueShouldBe>,
  context: FormContext<TDefinitionOfFormContext, TOutputOfFormContext>,
  objectArrayFieldPath: MaybeRef<TObjectArrayFieldPath>,
  index: MaybeRef<number>,
  itemValueProperty: MaybeRef<TItemValueProperty>
): Ref<DefineFieldTuple<TItemValueShouldBe[TItemValueProperty]>> {

  const regenerate = (strFieldPath : TPathOfFormContext) => context.defineField<
  TPathOfFormContext,
  TItemValueShouldBe[TItemValueProperty],
  VeeVuetifyConverterGenericObject
  >(
    strFieldPath,
    veeVuetifyConverter
  )

  // 初期値を元に defineField を実行して返すべきrefオブジェクトを作る
  const initVeeValidatePath = toValue(objectArrayFieldPath)
  const initIndex = toValue(index)
  const initItemProperty = toValue(itemValueProperty)
  const initFieldPath = getFieldPath(initVeeValidatePath, initIndex, initItemProperty) as TPathOfFormContext
  const defineFieldTuple = ref<DefineFieldTuple<TItemValueShouldBe[TItemValueProperty]>>(regenerate(initFieldPath))


  // objectArrayFieldPath, index, itemProperty に変更があれば defineField をやり直す
  watchEffect(() => {
    const veeValidatePath = toValue(objectArrayFieldPath)
    const indexValue = toValue(index)
    const itemProperty = toValue(itemValueProperty)
    const fieldPath = getFieldPath(veeValidatePath, indexValue, itemProperty) as TPathOfFormContext
    defineFieldTuple.value = regenerate(fieldPath)
  })

  return defineFieldTuple
}
