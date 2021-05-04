import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import movie from '~/store/movie'
import loadImage from '~/plugins/loadImage'
import Movie from '~/pages/movie/_id'

describe('pages/movie/_id.vue', () => {
  let wrapper

  beforeEach(() => {
    const localVue = new createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuex)
    localVue.use(loadImage)

    const router = new VueRouter
    const store = new Vuex.Store({
      modules: {
        movie
      }
    })

    wrapper = shallowMount(Movie, {
      localVue,
      store,
      router,
      stubs: {
        NuxtLink: true
      }
    })
    router.push('/movie/tt1234567')
  })

  test('최초 접속한 URL을 확인합니다', () => {
    // 설정
    // 동작
    // 확인
    expect(wrapper.vm.$route.fullPath).toBe('/movie/tt1234567')
  })

  test('지정한 이미지 크기로 URL을 변경합니다', () => {
    // 설정
    const url = 'https://google.com/sample_image_SX300.jpg'
    // 동작
    // 확인
    expect(wrapper.vm.requestDiffSizeImage(url)).toContain('SX700')
    expect(wrapper.vm.requestDiffSizeImage(url, 900)).toContain('SX900')
  })

  test('정상적인 이미지 주소가 아닌 경우 빈 문자를 반환합니다', () => {
    expect(wrapper.vm.requestDiffSizeImage()).toBe('')
    expect(wrapper.vm.requestDiffSizeImage('N/A')).toBe('')
  })
})
