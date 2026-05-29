import { Box, Chip, useMediaQuery, Theme } from '@mui/material'
import {
    CreateButton,
    Empty,
    ExportButton,
    FilterButton,
    FilterForm,
    FilterContext,
    InputProps,
    ListBase,
    NumberInput,
    Pagination,
    SearchInput,
    SortButton,
    Title,
    TopToolbar,
    useListContext,
    useTranslate,
    useGetResourceLabel,
} from 'react-admin'

import ImageList from './GridList'

const ItemListContent = ({ isSmall }: { isSmall: boolean }) => {
    const { data, isLoading, filterValues } = useListContext()
    const hasFilters = filterValues && Object.keys(filterValues).length > 0
    if (!isLoading && (!data || data.length === 0) && !hasFilters) {
        return <Empty />
    }
    return (
        <Box display="flex">
            <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'}>
                <ImageList />
                <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
            </Box>
        </Box>
    )
}

const ItemList = () => {
    const getResourceLabel = useGetResourceLabel()
    const isSmall = useMediaQuery<Theme>((theme) =>
        theme.breakpoints.down('md'),
    )
    return (
        <ListBase perPage={24} sort={{ field: 'reference', order: 'ASC' }}>
            <Title defaultTitle={getResourceLabel('ite', 2)} />
            <FilterContext.Provider value={productFilters}>
                <ListActions isSmall={isSmall} />
                {isSmall && (
                    <Box m={1}>
                        <FilterForm />
                    </Box>
                )}
            </FilterContext.Provider>
            <ItemListContent isSmall={isSmall} />
        </ListBase>
    )
}

const QuickFilter = ({ label }: InputProps) => {
    const translate = useTranslate()
    return <Chip sx={{ mb: 1 }} label={translate(label as string)} />
}

export const productFilters = [
    <SearchInput source="q" alwaysOn />,
    <NumberInput source="width_gte" />,
    <NumberInput source="width_lte" />,
    <NumberInput source="height_gte" />,
    <NumberInput source="height_lte" />,
    <QuickFilter label="stock_lte" source="stock_lte" defaultValue={10} />,
]

const ListActions = ({ isSmall }: any) => (
    <TopToolbar>
        {isSmall && <FilterButton />}
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
)

export default ItemList
