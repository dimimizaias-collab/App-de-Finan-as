-- ==========================================
-- Esquema para App de Controle Financeiro
-- Otimizado para Supabase (PostgreSQL)
-- ==========================================

-- 1. Tabela de Perfis de Usuários (Estendendo auth.users do Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Contas (Carteira, Conta Corrente, Poupança, etc)
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'wallet', 'credit_card', 'investment')),
  balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Categorias (Alimentação, Transporte, Salário, etc)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#000000',
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Transações (Receitas e Despesas)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_paid BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Configuração de Segurança (Row Level Security - RLS)
-- Garante que uauários só vejam os próprios dados
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Accounts
CREATE POLICY "Usuários podem ver as próprias contas" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir próprias contas" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias contas" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar próprias contas" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Categories
CREATE POLICY "Usuários podem ver as próprias categorias" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir próprias categorias" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias categorias" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar próprias categorias" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Transactions
CREATE POLICY "Usuários podem ver as próprias transações" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir próprias transações" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias transações" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar próprias transações" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- Triggers (Opcional - Criar Profile automaticamente no Auth)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
