import type { GenericObject, InputBindsConfig, PublicPathState } from "vee-validate";

export interface VeeVuetifyConverterGenericObject extends GenericObject {
  errorMessages: string[],
  error: boolean,
}

export type VeeVuetifyConverter = {
  props: ((state: any) => VeeVuetifyConverterGenericObject)
}

const veeVuetifyConverter : VeeVuetifyConverter = {
  props: ((state: PublicPathState<unknown>) => ({
    errorMessages: state.errors,
    error: state.errors.length > 0,
  }))
} satisfies Partial<InputBindsConfig<unknown>>;

export default veeVuetifyConverter;
