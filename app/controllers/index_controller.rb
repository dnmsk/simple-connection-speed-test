class IndexController < ApplicationController
  def index
    @vue_app = 'application'
  end

  def ping
    head :ok
  end
end
