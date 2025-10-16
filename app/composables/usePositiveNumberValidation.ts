import {computed, type Ref} from 'vue'

export function usePositiveNumberValidation(amount: Ref<number | null>) {
  const isValid = computed(() => {
      if (amount.value === null || amount.value === undefined) {
        return false
      }
      return Number(amount.value) > 0
    }
  )

  const errorMessage = computed(() => {
    if (amount.value === null || amount.value === undefined) {
      return 'Obrigatório'
    }
    if (Number(amount.value) <= 0) {
      return 'Deve ser um número positivo'
    }
    return ''
  })

  return {isValid, errorMessage}
}
