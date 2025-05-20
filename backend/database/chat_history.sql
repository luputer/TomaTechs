-- Drop existing table if exists
drop table if exists chat_history;

-- Create new chat history table
create table chat_history (
    id uuid default uuid_generate_v4() primary key,
    message text not null,
    is_bot boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for faster queries
create index chat_history_created_at_idx on chat_history(created_at); 