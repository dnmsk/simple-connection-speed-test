class TimeoutStreamWriter
  MIN_BLOCK_SIZE = (20 * 1024).freeze
  MAX_BLOCK_SIZE = (50 * MIN_BLOCK_SIZE).freeze

  def initialize(stream, timeout:, block_size:, max_bytes:)
    @stream= stream
    @timeout = avg(5, timeout, 20)
    @block_size = avg(MIN_BLOCK_SIZE, block_size, MAX_BLOCK_SIZE * 10)
    @max_bytes = avg(@block_size, max_bytes, MAX_BLOCK_SIZE * 1024)
  end

  def call
    begin
      Timeout::timeout(@timeout) do
        sended = 0
        loop do
          sended += @block_size
          @stream.write(rnd_sequence(@block_size))
          break if sended >= @max_bytes
        end
      end
    rescue => e
    end
  end

  private

  def avg(min, val, max)
    [[min, val].max, max].min
  end

  def rnd_sequence(length)
    Random.urandom(length)
    #'s' * length
    #Array.new(length) { |i| other[i] }
  end
end
