import React from 'react'
import {
  customRender as render,
  flushMicrotasksQueue,
  waitForElement,
  store
} from 'custom-render-example'
import JokeContainer from 'component-example'
import * as requestUtils from 'utils/request'

const jokeText =
  'Chuck Norris once pulled out a single hair from his beard and skewered three men through the heart with it'

beforeEach(() => {
  requestUtils.request = jest.fn(() =>
    Promise.resolve({
      type: 'success',
      value: {
        id: 440,
        joke: jokeText,
        categories: [],
      },
    }),
  )
})

afterEach(() => {
  requestUtils.request.mockClear()
  store.dispatch({ type: 'RESET' })
})

describe('<JokeContainer />', () => {
  it('renders a joke when the component mounts', async () => {
    const { getByText } = render(<JokeContainer />)
    await flushMicrotasksQueue()
    expect(requestUtils.request).toHaveBeenCalledTimes(1)
    const joke = await waitForElement(() => getByText(jokeText))
    expect(joke).toBeDefined()
  })

  it('renders a loading indicator while the joke is loading', async () => {
    const { getByText, queryByText } = render(<JokeContainer />)
    const loadingText = 'Loading...'
    expect(getByText(loadingText)).toBeDefined()
    await flushMicrotasksQueue()
    expect(requestUtils.request).toHaveBeenCalledTimes(1)
    expect(queryByText(loadingText)).toBeNull()
  })

  it('renders an error when there is an error getting the joke', async () => {
    requestUtils.request.mockRejectedValueOnce({ error: 'joke not found' })
    const { getByText } = render(<JokeContainer />)
    const errorMessageText = 'Oops, something went wrong.'
    await flushMicrotasksQueue()
    expect(requestUtils.request).toHaveBeenCalledTimes(1)
    expect(getByText(errorMessageText)).toBeDefined()
  })
})
