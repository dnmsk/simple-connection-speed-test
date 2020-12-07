Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'index#index'
  get :ping, to: 'index#ping'

  resource :stream, only: [:show, :create]
end
