require 'net/ssh/proxy/command'

# config valid for current version and patch releases of Capistrano
lock "~> 3.13.0"

set :rbenv_type, :user
set :rbenv_ruby, File.read('.ruby-version').strip

set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
set :rbenv_map_bins, %w(rake gem bundle ruby rails)
set :rbenv_roles, :all # default value

set :ssh_options, {
  auth_methods: %w(publickey),
  #proxy: Net::SSH::Proxy::Command.new('ssh devel@dklimanov.ru -W %h:%p')
}

set :application, 'ru_dnmsk_speed_test'
set :repo_url, ->{ 'git@github.com:dnmsk/simple-connection-speed-test.git' }
set :rack_env, fetch(:stage)

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, -> { current_branch }

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :info

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push(
  'config/application.yml',
  'config/secrets.yml'
)

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push(
  'log',
  'tmp/pids',
  'tmp/cache',
  'tmp/sockets',
  'public/system',
  'node_modules'
)

# Default value for keep_releases is 5
set :keep_releases, 5

def current_branch
  ENV['BRANCH'] || `git rev-parse --abbrev-ref HEAD`.chomp
end

namespace :puma do
  desc 'Restart puma'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo systemctl restart #{fetch :application}_#{fetch :stage}.service"
    end
  end
end

after 'deploy:published', 'puma:restart'
after 'deploy:finishing', 'deploy:cleanup'

Airbrussh.configure do |config|
  config.truncate = false
end
