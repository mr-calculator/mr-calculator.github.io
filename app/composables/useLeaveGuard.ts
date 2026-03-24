import { onMounted, onBeforeUnmount, type Ref, type ComputedRef, isRef } from 'vue'
import { onBeforeRouteLeave, type NavigationGuardNext, type RouteLocationNormalizedGeneric, type RouteLocationNormalizedLoadedGeneric } from 'vue-router'

type LeaveGuardCondition = Ref<boolean> | ComputedRef<boolean>

export function useLeaveGuard(
    condition: LeaveGuardCondition,
    message = 'Ai modificări nesalvate, ești sigur că vrei să părăsești pagina?'
) {
    const shouldBlock = isRef(condition) ? condition : ref(false)

    const instance = getCurrentInstance()
    const routeGuardManager = instance?.appContext.config.globalProperties.$routeGuardManager

    const guardId = `leave-guard-${Math.random().toString(36).substr(2, 9)}`

    const guard = (to: RouteLocationNormalizedGeneric,
                   from: RouteLocationNormalizedLoadedGeneric, 
                   next: NavigationGuardNext
                  ) =>
    {
        if (!shouldBlock.value) return next()

        if (window.confirm(message)) return next()
        return next(false)
    }

    if (routeGuardManager) {
        routeGuardManager.addGuard(guardId, guard)
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!shouldBlock.value) return
        e.preventDefault()
        e.returnValue = ''
    }

    onMounted(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        routeGuardManager?.removeGuard(guardId)
    })

    onBeforeRouteLeave((_to, _from, next) => {
        if (!shouldBlock.value) return next()
        if (window.confirm(message)) return next()
        return next(false)
    })

    return {
        shouldBlock, // expose in case you want to debug
    }
}
