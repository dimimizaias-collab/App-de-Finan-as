-- DESCOMENTE AS LINHAS ABAIXO SE QUISER APAGAR TUDO E COMEÇAR DO ZERO (CUIDADO: APAGA TODOS OS DADOS)
-- DROP TABLE IF EXISTS public.transactions CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;
-- DROP TABLE IF EXISTS public.accounts CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Contas
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'wallet', 'credit_card', 'investment')),
  balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  bank_name TEXT,
  account_number TEXT,
  agency TEXT,
  image_url TEXT,
  color TEXT DEFAULT '#9e3c00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migração: Adicionar colunas se a tabela já existia sem elas
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'accounts' AND COLUMN_NAME = 'bank_name') THEN
    ALTER TABLE public.accounts ADD COLUMN bank_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'accounts' AND COLUMN_NAME = 'account_number') THEN
    ALTER TABLE public.accounts ADD COLUMN account_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'accounts' AND COLUMN_NAME = 'agency') THEN
    ALTER TABLE public.accounts ADD COLUMN agency TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'accounts' AND COLUMN_NAME = 'image_url') THEN
    ALTER TABLE public.accounts ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'accounts' AND COLUMN_NAME = 'color') THEN
    ALTER TABLE public.accounts ADD COLUMN color TEXT DEFAULT '#9e3c00';
  END IF;
END $$;

-- 3. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#000000',
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Transações
CREATE TABLE IF NOT EXISTS public.transactions (
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

-- Migração: Adicionar colunas se a tabela transactions já existia sem elas
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'category_id') THEN
    ALTER TABLE public.transactions ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'is_paid') THEN
    ALTER TABLE public.transactions ADD COLUMN is_paid BOOLEAN DEFAULT true NOT NULL;
  END IF;
END $$;

-- ==========================================
-- Configuração de Segurança (Row Level Security - RLS)
-- Garante que uauários só vejam os próprios dados
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir o próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Accounts
DROP POLICY IF EXISTS "Usuários podem ver as próprias contas" ON public.accounts;
DROP POLICY IF EXISTS "Usuários podem inserir próprias contas" ON public.accounts;
DROP POLICY IF EXISTS "Usuários podem atualizar próprias contas" ON public.accounts;
DROP POLICY IF EXISTS "Usuários podem deletar próprias contas" ON public.accounts;
CREATE POLICY "Usuários podem ver as próprias contas" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir próprias contas" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias contas" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar próprias contas" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Categories
DROP POLICY IF EXISTS "Usuários podem ver as próprias categorias" ON public.categories;
DROP POLICY IF EXISTS "Usuários podem inserir próprias categorias" ON public.categories;
DROP POLICY IF EXISTS "Usuários podem atualizar próprias categorias" ON public.categories;
DROP POLICY IF EXISTS "Usuários podem deletar próprias categorias" ON public.categories;
CREATE POLICY "Usuários podem ver as próprias categorias" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir próprias categorias" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias categorias" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar próprias categorias" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Transactions
DROP POLICY IF EXISTS "Usuários podem ver as próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem inserir próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem atualizar próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem deletar próprias transações" ON public.transactions;
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

-- Políticas para Storage (Imagens de Contas)
-- ==========================================

-- Garante que o bucket existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('account-images', 'account-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Permite que usuários autenticados enviem imagens para sua própria pasta
DROP POLICY IF EXISTS "Usuários podem enviar as próprias imagens" ON storage.objects;
CREATE POLICY "Usuários podem enviar as próprias imagens"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'account-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Permite que usuários autenticados atualizem suas próprias imagens
DROP POLICY IF EXISTS "Usuários podem atualizar as próprias imagens" ON storage.objects;
CREATE POLICY "Usuários podem atualizar as próprias imagens"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'account-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Permite que qualquer pessoa veja as imagens (bucket é público)
DROP POLICY IF EXISTS "Imagens de contas são públicas para visualização" ON storage.objects;
CREATE POLICY "Imagens de contas são públicas para visualização"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'account-images');
-- ==========================================
-- Funções e Triggers de Auditoria
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_accounts ON public.accounts;
CREATE TRIGGER set_updated_at_accounts BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_transactions ON public.transactions;
CREATE TRIGGER set_updated_at_transactions BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==========================================
-- Categorias Padrão (Seed)
-- ==========================================

-- Nota: Como o banco foi resetado, é importante ter algumas categorias básicas.
-- O script abaixo insere categorias genéricas se elas não existirem.
-- No Supabase, o user_id é necessário. Como este script roda globalmente, 
-- o ideal é que o app crie categorias iniciais no primeiro login.
-- Mas para facilitar, vamos deixar as queries comentadas ou estruturadas.

/*
INSERT INTO public.categories (name, color, icon, type, user_id) VALUES 
('Salário', '#1e8449', 'payments', 'income', 'SEU_USER_ID_AQUI'),
('Investimentos', '#1a5276', 'trending_up', 'income', 'SEU_USER_ID_AQUI'),
('Alimentação', '#9e3c00', 'restaurant', 'expense', 'SEU_USER_ID_AQUI'),
('Transporte', '#b31b25', 'directions_car', 'expense', 'SEU_USER_ID_AQUI'),
('Lazer', '#6c3483', 'sports_esports', 'expense', 'SEU_USER_ID_AQUI'),
('Saúde', '#b7950b', 'medical_services', 'expense', 'SEU_USER_ID_AQUI');
*/

-- ==========================================
-- Índices para Performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

