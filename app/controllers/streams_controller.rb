class StreamsController < ApplicationController
  include ActionController::Live

  def show
    return head(:ok) if request.head?

    response.headers['Content-Type'] = 'application/octet-stream'
    TimeoutStreamWriter.new(response.stream,
      timeout: params[:t].to_i,
      block_size: params[:b].to_i,
      max_bytes: params[:l].to_i
    ).()
  ensure
    response.stream.close
  end

  def create
    render(json: {})
  end
end
