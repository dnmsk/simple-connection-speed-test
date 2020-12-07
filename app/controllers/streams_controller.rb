class StreamsController < ApplicationController
  include ActionController::Live

  def head
  end

  def show
    response.headers['Content-Type'] = 'application/octet-stream'
    #response.headers['Content-Type'] = 'text/event-stream'
    #response.headers["Cache-Control"] = "no-cache"
    #response.headers["X-Accel-Buffering"] = "no"
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
