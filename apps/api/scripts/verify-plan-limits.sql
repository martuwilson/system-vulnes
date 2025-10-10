-- Verificar que los nuevos campos se han poblado correctamente
SELECT 
    plan,
    -- Campos antiguos
    max_domains as "maxDomains (old)",
    max_assets as "maxAssets (old)",
    -- Campos nuevos
    max_companies as "maxCompanies (new)",
    max_assets_per_company as "maxAssetsPerCompany (new)",
    -- Otros campos relevantes
    price_usd as "priceUsd"
FROM plan_limits 
ORDER BY 
    CASE plan 
        WHEN 'TRIAL' THEN 1
        WHEN 'STARTER' THEN 2
        WHEN 'GROWTH' THEN 3
        WHEN 'PRO' THEN 4
    END;